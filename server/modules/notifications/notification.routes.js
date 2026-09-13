import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import requireAuth from "../../middleware/requireAuth.js";
import { ValidationError } from "../../lib/errors.js";
import { notificationsQuerySchema } from "./notification.schema.js";
import {
    listNotifications,
    getUnreadCount,
    markAllRead,
} from "./notification.service.js";

const router = Router();

router.get(
    "/unread-count",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        res.json(await getUnreadCount(req.user.id));
    }),
);

router.get(
    "/",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const parsed = notificationsQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        res.json(
            await listNotifications(req.user.id, {
                page: parsed.data.page,
                pageSize: parsed.data.limit,
            }),
        );
    }),
);

router.put(
    "/read",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        res.json(await markAllRead(req.user.id));
    }),
);

export default router;
