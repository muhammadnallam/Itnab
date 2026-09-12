import { recomputeScores } from "../../lib/gravity.js";
import { recomputeAuthorScores } from "../../lib/author-score.js";

export function checkCronSecret(req, res, next) {
    if (req.headers["x-cron-secret"] !== process.env.CRON_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
}

// POST /api/jobs/feed-gravity
export async function feedGravityHandler(req, res, next) {
    try {
        const updatedCount = await recomputeScores();
        res.json({ ok: true, updatedCount, ranAt: new Date().toISOString() });
    } catch (e) {
        next(e);
    }
}

// POST /api/jobs/author-score
export async function authorScoreHandler(req, res, next) {
    try {
        const updatedCount = await recomputeAuthorScores();
        res.json({ ok: true, updatedCount, ranAt: new Date().toISOString() });
    } catch (e) {
        next(e);
    }
}
