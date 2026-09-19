import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import {
    getSitemapMeta,
    getSitemapArticles,
    getSitemapAuthors,
} from "./sitemap.service.js";

const router = Router();

const MAX_LIMIT = 50000;

function parsePaging(query) {
    const offset = Math.max(parseInt(query.offset, 10) || 0, 0);
    const rawLimit = parseInt(query.limit, 10) || MAX_LIMIT;
    const limit = Math.min(Math.max(rawLimit, 1), MAX_LIMIT);
    return { offset, limit };
}

router.get(
    "/meta",
    asyncErrorHandler(async (req, res) => {
        res.json(await getSitemapMeta());
    }),
);

router.get(
    "/articles",
    asyncErrorHandler(async (req, res) => {
        const { offset, limit } = parsePaging(req.query);
        res.json(await getSitemapArticles({ offset, limit }));
    }),
);

router.get(
    "/authors",
    asyncErrorHandler(async (req, res) => {
        const { offset, limit } = parsePaging(req.query);
        res.json(await getSitemapAuthors({ offset, limit }));
    }),
);

export default router;
