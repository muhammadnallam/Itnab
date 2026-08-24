import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import requireAuth from "../../middleware/requireAuth.js";
import optionalAuth from "../../middleware/optionalAuth.js";
import { viewLimiter, shareLimiter } from "../../middleware/rateLimit.js";
import { getClientIp, hashIp } from "../../lib/identity.js";
import { parseUserAgent } from "../../lib/userAgent.js";
import { getCountry } from "../../lib/geo.js";
import { ValidationError } from "../../lib/errors.js";
import {
    reactionSchema,
    platformSchema,
    saveSchema,
} from "./interactions.schema.js";
import {
    getFollow,
    followUser,
    unfollowUser,
    getLikes,
    setReaction,
    deleteReaction,
    getSaveState,
    saveArticle,
    unsaveArticle,
    shareArticle,
    recordView,
} from "./interactions.service.js";

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
    "/users/:userId/follow",
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.userId);
        res.json(await getFollow(req.params.userId, req.user?.id));
    }),
);

router.put(
    "/users/:userId/follow",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.userId);
        res.json(await followUser(req.params.userId, req.user.id));
    }),
);

router.delete(
    "/users/:userId/follow",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.userId);
        res.json(await unfollowUser(req.params.userId, req.user.id));
    }),
);

router.get(
    "/articles/:articleId/likes",
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.articleId);
        res.json(await getLikes(req.params.articleId, req.user?.id));
    }),
);

router.put(
    "/articles/:articleId/likes",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.articleId);
        const parsed = reactionSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        res.json(
            await setReaction(
                req.params.articleId,
                parsed.data.type,
                req.user.id,
            ),
        );
    }),
);

router.delete(
    "/articles/:articleId/likes",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.articleId);
        res.json(await deleteReaction(req.params.articleId, req.user.id));
    }),
);

router.get(
    "/articles/:articleId/save",
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.articleId);
        res.json(await getSaveState(req.params.articleId, req.user?.id));
    }),
);

router.put(
    "/articles/:articleId/save",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.articleId);
        const parsed = saveSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        res.json(
            await saveArticle(
                req.params.articleId,
                req.user.id,
                parsed.data.listId,
            ),
        );
    }),
);

router.delete(
    "/articles/:articleId/save",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.articleId);
        const parsed = saveSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        res.json(
            await unsaveArticle(
                req.params.articleId,
                req.user.id,
                parsed.data.listId,
            ),
        );
    }),
);

router.post(
    "/articles/:articleId/share",
    shareLimiter,
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.articleId);
        const parsed = platformSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        const guestId = req.user ? null : hashIp(getClientIp(req));
        res.json(
            await shareArticle(
                req.params.articleId,
                parsed.data.platform,
                req.user?.id ?? null,
                guestId,
            ),
        );
    }),
);

router.post(
    "/articles/:articleId/view",
    viewLimiter,
    optionalAuth,
    asyncErrorHandler(async (req, res) => {
        assertUuid(req.params.articleId);
        const ip = getClientIp(req);
        const guestId = req.user ? null : hashIp(ip);
        const { deviceType, browser, os } = parseUserAgent(
            req.headers["user-agent"],
        );
        const country = await getCountry(ip);
        const referrer =
            typeof req.headers.referer === "string"
                ? req.headers.referer
                : null;
        res.json(
            await recordView(req.params.articleId, req.user?.id ?? null, {
                guestId,
                deviceType,
                country,
                browser,
                os,
                referrer,
            }),
        );
        console.log(`Recorded view for article ${req.params.articleId} by user ${req.user?.id ?? "guest"}`);
    }),
);

export default router;
