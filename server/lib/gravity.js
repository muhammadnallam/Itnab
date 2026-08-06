import cron from "node-cron";
import prisma from "./prisma.js";
import { clearFeedCache } from "./cache/feed-cache.js";

export const WEIGHTS = {
    views: 0.15,
    likes: 1,
    comments: 4,
    shares: 5,
    bookmarks: 6,
};

export const G = 1.3;
export const M0 = 1.8; // Cold-start multiplier ceiling (M0): at t = 0, M(t) = M0.
export const DECAY_SPEED = 18;
export const OFFSET = 2;
export const CRON_EXPRESSION = "*/15 * * * *";

const HOUR = 60 * 60 * 1000;

export function computeScore({
    views = 0,
    likes = 0,
    comments = 0,
    shares = 0,
    bookmarks = 0,
    ageHours = 0,
}) {
    const t = Math.max(0, ageHours); // ensures it is not negative

    const engagementRate =
        WEIGHTS.views * views +
        WEIGHTS.likes * likes +
        WEIGHTS.comments * comments +
        WEIGHTS.shares * shares +
        WEIGHTS.bookmarks * bookmarks +
        1; // 1 is offset for new articles to avoid zero score

    const denominator = Math.pow(t + OFFSET, G);

    const coldStartMultiplier = 1 + (M0 - 1) * Math.exp(-t / DECAY_SPEED);

    return denominator === 0
        ? 0
        : (engagementRate / denominator) * coldStartMultiplier;
}

async function getInteractionCount(model) {
    const rows = await model.groupBy({
        by: ["articleId"],
        _count: { _all: true },
    });
    const map = {};
    for (const row of rows) map[row.articleId] = row._count._all;
    return map;
}

export async function recomputeScores() {
    const counts = await Promise.all([
        getInteractionCount(prisma.like),
        getInteractionCount(prisma.bookmark),
        getInteractionCount(prisma.share),
        getInteractionCount(prisma.view),
    ]);
    const [likes, bookmarks, shares, views] = counts;

    const articles = await prisma.article.findMany({
        select: { id: true, createdAt: true },
    });

    const now = Date.now();
    let updatedCount = 0;
    for (const article of articles) {
        const ageHours = (now - article.createdAt.getTime()) / HOUR;
        // TODO: wire the comments count once a Comment model is implemented
        const score = computeScore({
            views: views[article.id] || 0,
            likes: likes[article.id] || 0,
            comments: 0,
            shares: shares[article.id] || 0,
            bookmarks: bookmarks[article.id] || 0,
            ageHours,
        });

        await prisma.article.updateMany({
            where: { id: article.id },
            data: { score },
        });
        updatedCount += 1;
    }

    clearFeedCache();

    return updatedCount;
}

let isRunning = false;

export function startGravityCron() {
    cron.schedule(CRON_EXPRESSION, async () => {
        if (isRunning) {
            console.warn(
                "[gravity] Skipping run: previous run still in progress",
            );
            return;
        }
        isRunning = true;
        try {
            const updatedCount = await recomputeScores();
            console.log(`[gravity] Recomputed scores for ${updatedCount} articles`);
        } catch (err) {
            console.error("[gravity] Recompute failed:", err);
        } finally {
            isRunning = false;
        }
    });
    console.log(`[gravity] Cron scheduled (${CRON_EXPRESSION})`);
}
