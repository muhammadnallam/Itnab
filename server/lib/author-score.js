import cron from "node-cron";
import prisma from "./prisma.js";
import { M0 } from "./gravity.js";
import { getAuthorCache, setAuthorCache, clearAuthorCache } from "./cache/author-cache.js";

export const K = 7;
export const TAU_AUTHOR_DAYS = 21;
export const W_F = 0.08;
export const CRON_AUTHOR = "0 3 * * *";

const DAY = 86400000;

export function computeAuthorScore({ avgScore, daysSinceLastArticle, followerCount }) {
    const t = Math.max(0, daysSinceLastArticle);
    const mAuthor = 1 + (M0 - 1) * Math.exp(-t / TAU_AUTHOR_DAYS);
    const followerTerm = W_F * Math.log(1 + followerCount);
    return avgScore * mAuthor + followerTerm;
}

export async function recomputeAuthorScores() {
    const meanRow = await prisma.article.aggregate({
        where: { deletedAt: null },
        _avg: { score: true },
    });
    const mu = meanRow._avg.score ?? 0;

    const grouped = await prisma.article.groupBy({
        by: ["authorId"],
        where: { deletedAt: null },
        _sum: { score: true },
        _count: { id: true },
        _max: { createdAt: true },
    });

    const now = Date.now();
    let updatedCount = 0;

    for (const g of grouped) {
        const sumS = g._sum.score ?? 0;
        const N = g._count.id;
        if (N === 0) continue;

        const avgScore = (sumS + K * mu) / (N + K);
        const daysSinceLastArticle = (now - g._max.createdAt.getTime()) / DAY;

        const user = await prisma.user.findUnique({
            where: { id: g.authorId },
            select: { followerCount: true },
        });
        if (!user) continue;

        const score = computeAuthorScore({
            avgScore,
            daysSinceLastArticle,
            followerCount: user.followerCount,
        });

        await prisma.user.updateMany({
            where: { id: g.authorId },
            data: { authorScore: score },
        });
        updatedCount += 1;
    }

    clearAuthorCache();
    return updatedCount;
}

export async function getTopAuthors({ userId, limit = 10 } = {}) {
    const cacheKey = `top:${limit}`;
    const cached = getAuthorCache(cacheKey);
    if (cached) {
        return filterAuthors(cached, userId, limit);
    }

    const top50 = await prisma.user.findMany({
        where: {
            authorScore: { gt: 0 },
            articles: { some: { deletedAt: null } },
        },
        orderBy: { authorScore: "desc" },
        select: {
            id: true,
            name: true,
            username: true,
            image: true,
            followerCount: true,
            authorScore: true,
        },
        take: 50,
    });

    setAuthorCache(cacheKey, top50);
    return filterAuthors(top50, userId, limit);
}

async function filterAuthors(authors, userId, limit) {
    if (!userId) return authors.slice(0, limit);

    const follows = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
    });
    const followedIds = new Set(follows.map((f) => f.followingId));

    return authors
        .filter((a) => a.id !== userId && !followedIds.has(a.id))
        .slice(0, limit);
}

let isRunning = false;

export function startAuthorScoreCron() {
    cron.schedule(CRON_AUTHOR, async () => {
        if (isRunning) {
            console.warn("[author-score] Skipping run: previous run still in progress");
            return;
        }
        isRunning = true;
        try {
            const updatedCount = await recomputeAuthorScores();
            console.log(`[author-score] Recomputed scores for ${updatedCount} authors`);
        } catch (err) {
            console.error("[author-score] Recompute failed:", err);
        } finally {
            isRunning = false;
        }
    });
    console.log(`[author-score] Cron scheduled (${CRON_AUTHOR})`);
}
