import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import requireAuth from "../../middleware/requireAuth";
import asyncErrorHandler from "../../middleware/asyncErrorHandler";
import {
    getProfile,
    updateProfile,
    updatePassword,
    deleteUserAccount,
    getUserSaves,
    getUserViews,
    getFollowing,
} from "./user.service.js";
import {
    profileSchema,
    passwordSchema,
    socialLinksSchema,
    libraryQuerySchema,
} from "./user.schema.js";

const router = Router();

router.get(
    "/:username/profile",
    asyncErrorHandler(async (req, res) => {
        const profile = await getProfile(req.params.username);
        res.json(profile);
    }),
);

router.put(
    "/update-profile",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const result = profileSchema.safeParse(req.body);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            const firstError =
                Object.values(fieldErrors).flat()[0] || "بيانات غير صالحة";
            return res.status(400).json({ error: firstError });
        }

        const profile = await updateProfile(req.user.id, result.data);
        res.json(profile);
    }),
);

router.put(
    "/update-social-links",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const result = socialLinksSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: "بيانات غير صالحة" });
        }

        const profile = await updateProfile(req.user.id, result.data);
        res.json(profile);
    }),
);

router.put(
    "/update-password",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const result = passwordSchema.safeParse(req.body);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            const firstError =
                Object.values(fieldErrors).flat()[0] || "بيانات غير صالحة";
            return res.status(400).json({ error: firstError });
        }

        await updatePassword(
            req.user.id,
            result.data.currentPassword,
            result.data.newPassword,
            fromNodeHeaders(req.headers),
        );
        res.json({ success: true });
    }),
);

router.post(
    "/delete-account",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        await deleteUserAccount(req.user.id);
        res.json({ success: true });
    }),
);

router.get(
    "/:id/saves",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: "غير مصرح لك" });
        }
        const parsed = libraryQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: "بيانات غير صالحة" });
        }
        const { page, limit } = parsed.data;
        const result = await getUserSaves(req.params.id, {
            page,
            pageSize: limit,
        });
        res.json(result);
    }),
);

router.get(
    "/:id/views",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: "غير مصرح لك" });
        }
        const parsed = libraryQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: "بيانات غير صالحة" });
        }
        const { page, limit } = parsed.data;
        const result = await getUserViews(req.params.id, {
            page,
            pageSize: limit,
        });
        res.json(result);
    }),
);

router.get(
    "/:id/following",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ error: "غير مصرح لك" });
        }
        const parsed = libraryQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: "بيانات غير صالحة" });
        }
        const { page, limit } = parsed.data;
        const result = await getFollowing(req.params.id, {
            page,
            pageSize: limit,
        });
        res.json(result);
    }),
);

export default router;
