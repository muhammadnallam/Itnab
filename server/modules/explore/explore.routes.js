import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import { getRecommendations, getTopTags } from "./explore.service.js";
import { getTopAuthors } from "../../lib/author-score.js";

const router = Router();

router.get(
    "/recommendations",
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        const result = await getRecommendations({ userId: req.user?.id });
        res.json(result);
    }),
);

router.get(
    "/top-authors",
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 20);
        const authors = await getTopAuthors({ userId: req.user?.id, limit });
        res.json({ authors });
    }),
);

router.get(
    "/tags",
    asyncErrorHandler(async (req, res) => {
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 8, 1), 20);
        const tags = await getTopTags(limit);
        res.json({ tags });
    }),
);

export default router;
