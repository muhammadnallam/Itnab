import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import requireAuth from "../../middleware/requireAuth.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import { commentLimiter } from "../../middleware/rateLimit.js";
import { ValidationError } from "../../lib/errors.js";
import {
    createCommentSchema,
    updateCommentSchema,
    commentsQuerySchema,
} from "./comment.schema.js";
import {
    listComments,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
} from "./comment.service.js";

const router = Router();

const INVALID_ID = "معرف غير صالح";

function assertUuid(value) {
    if (
        typeof value !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            value,
        )
    ) {
        throw new ValidationError(INVALID_ID);
    }
}

router.get(
    "/articles/:articleId/comments",
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.articleId);
        const parsed = commentsQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        res.json(
            await listComments(req.params.articleId, {
                page: parsed.data.page,
                pageSize: parsed.data.limit,
                userId: req.user?.id,
            }),
        );
    }),
);

router.post(
    "/articles/:articleId/comments",
    requireAuth,
    commentLimiter,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.articleId);
        const parsed = createCommentSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        res.status(201).json(
            await createComment(
                req.params.articleId,
                parsed.data,
                req.user.id,
            ),
        );
    }),
);

router.put(
    "/comments/:commentId",
    requireAuth,
    commentLimiter,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.commentId);
        const parsed = updateCommentSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        res.json(
            await updateComment(
                req.params.commentId,
                parsed.data.content,
                req.user.id,
            ),
        );
    }),
);

router.delete(
    "/comments/:commentId",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.commentId);
        res.json(await deleteComment(req.params.commentId, req.user.id));
    }),
);

router.put(
    "/comments/:commentId/like",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.commentId);
        res.json(await likeComment(req.params.commentId, req.user.id));
    }),
);

router.delete(
    "/comments/:commentId/like",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.commentId);
        res.json(await unlikeComment(req.params.commentId, req.user.id));
    }),
);

export default router;
