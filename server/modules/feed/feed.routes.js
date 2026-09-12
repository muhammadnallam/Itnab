import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import requireAuth from "../../middleware/requireAuth.js";
import { ValidationError } from "../../lib/errors.js";
import {
    getFeed,
    getUserLists,
    createUserList,
    getList,
    renameList,
    deleteList,
    saveList,
    unsaveList,
} from "./feed.service.js";
import {
    feedQuerySchema,
    listsQuerySchema,
    createListSchema,
    renameListSchema,
} from "./feed.schema.js";

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
    optionalAuth,
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
            userId: req.user?.id,
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

router.get(
    "/lists/:listId",
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        const result = await getList({
            listId: req.params.listId,
            userId: req.user?.id,
        });
        res.json(result);
    }),
);

router.put(
    "/lists/:listId",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const parsed = renameListSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        const result = await renameList({
            listId: req.params.listId,
            userId: req.user.id,
            name: parsed.data.name,
        });
        res.json(result);
    }),
);

router.delete(
    "/lists/:listId",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const result = await deleteList({
            listId: req.params.listId,
            userId: req.user.id,
        });
        res.json(result);
    }),
);

router.put(
    "/lists/:listId/save",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const result = await saveList({
            listId: req.params.listId,
            userId: req.user.id,
        });
        res.json(result);
    }),
);

router.delete(
    "/lists/:listId/save",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const result = await unsaveList({
            listId: req.params.listId,
            userId: req.user.id,
        });
        res.json(result);
    }),
);

export default router;
