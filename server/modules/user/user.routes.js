import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import requireAuth from "../../middleware/requireAuth";
import asyncErrorHandler from "../../middleware/asyncErrorHandler";
import { getProfile, updateProfile, updatePassword } from "./user.service.js";
import {
    profileSchema,
    passwordSchema,
    socialLinksSchema,
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
        const result = updatePasswordSchema.safeParse(req.body);
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

export default router;
