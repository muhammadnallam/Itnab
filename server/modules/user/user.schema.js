import { z } from "zod";

export const profileSchema = z.object({
    name: z.string().min(1, "الاسم مطلوب").optional(),
    username: z
        .string()
        .min(1, "اسم المستخدم مطلوب")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط",
        )
        .optional(),
    bio: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
    bannerUrl: z.string().nullable().optional(),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z
        .string()
        .min(8, "كلمة المرور يجب أن تكون ٨ أحرف على الأقل")
        .max(20, "كلمة المرور يجب أن تكون ٢٠ حرفًا كحد أقصى"),
});

export const socialLinksSchema = z.object({
    socialLinks: z.object({
        website: z.string().nullable().optional(),
        youtube: z.string().nullable().optional(),
        x: z.string().nullable().optional(),
    }),
});

export const libraryQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});
