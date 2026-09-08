import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import requireAuth from "../../middleware/requireAuth.js";
import { ValidationError } from "../../lib/errors.js";
import { getFeed, getUserLists, createUserList } from "./feed.service.js";
import { feedQuerySchema, listsQuerySchema, createListSchema } from "./feed.schema.js";

const router = Router();

router.get(
    "/articles",
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        const parsed = feedQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        const { sort, page, limit, author, topic, filter } = parsed.data;
        const result = await getFeed({
            sort,
            author,
            topic,
            filter,
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
        const { author, articleId, page, limit } = parsed.data;
        const result = await getUserLists({
            author,
            articleId,
            page,
            pageSize: limit,
        });
        res.json(result);
    }),
);

router.post(
    "/lists",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const parsed = createListSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        const list = await createUserList({
            userId: req.user.id,
            name: parsed.data.name,
        });
        res.status(201).json(list);
    }),
);

export default router;
