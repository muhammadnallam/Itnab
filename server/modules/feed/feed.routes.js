import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import { ValidationError } from "../../lib/errors.js";
import { getFeed, getUserLists } from "./feed.service.js";
import { feedQuerySchema, listsQuerySchema } from "./feed.schema.js";

const router = Router();

router.get(
    "/articles",
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        const parsed = feedQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        const { sort, page, limit, author } = parsed.data;
        const result = await getFeed({
            sort,
            author,
            page,
            pageSize: limit,
            userId: req.user?.id,
        });
        res.json(result);
    }),
);

router.get(
    "/lists",
    asyncErrorHandler(async (req, res) => {
        const parsed = listsQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        const { author, page, limit } = parsed.data;
        const result = await getUserLists({ author, page, pageSize: limit });
        res.json(result);
    }),
);

export default router;
