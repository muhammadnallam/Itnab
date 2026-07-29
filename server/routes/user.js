import { Router } from "express";
import { z } from "zod";
import { fromNodeHeaders } from "better-auth/node";
import requireAuth from "../middleware/requireAuth";
import asyncErrorHandler from "../middleware/asyncErrorHandler";
import { getProfile, updateProfile, updatePassword } from "../services/userService";

const updateProfileSchema = z.object({
    name: z.string().min(1, "الاسم مطلوب"),
    username: z
        .string()
        .min(1, "اسم المستخدم مطلوب")
        .regex(/^[a-zA-Z0-9_]+$/, "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط"),
    bio: z.string().optional(),
});

const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z
        .string()
        .min(8, "كلمة المرور يجب أن تكون ٨ أحرف على الأقل")
        .max(20, "كلمة المرور يجب أن تكون ٢٠ حرفًا كحد أقصى"),
});

const socialLinksSchema = z.object({
    socialLinks: z.object({
        website: z.string().optional(),
        youtube: z.string().optional(),
        x: z.string().optional(),
    }),
});

const router = Router();

router.get(
    "/:username/profile",
    asyncErrorHandler(async (req, res) => {
        const profile = await getProfile(req.params.username);
        if (!profile) {
            return res.status(404).json({ error: "المستخدم غير موجود" });
        }
        res.json(profile);
    }),
);

router.put(
    "/update-profile",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const result = updateProfileSchema.safeParse(req.body);
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

        try {
            await updatePassword(
                req.user.id,
                result.data.currentPassword,
                result.data.newPassword,
                fromNodeHeaders(req.headers),
            );
        } catch (err) {
            if (err.status || err.statusCode) {
                return res
                    .status(err.status || err.statusCode)
                    .json({
                        error:
                            err.body?.message ||
                            err.message ||
                            "حدث خطأ أثناء تحديث كلمة المرور",
                    });
            }
            throw err;
        }
        res.json({ success: true });
    }),
);

export default router;
