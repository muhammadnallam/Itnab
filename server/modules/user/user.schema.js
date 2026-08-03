import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z.string().min(1, "الاسم مطلوب"),
    username: z
        .string()
        .min(1, "اسم المستخدم مطلوب")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط",
        ),
    bio: z.string().optional(),
});

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z
        .string()
        .min(8, "كلمة المرور يجب أن تكون ٨ أحرف على الأقل")
        .max(20, "كلمة المرور يجب أن تكون ٢٠ حرفًا كحد أقصى"),
});

export const socialLinksSchema = z.object({
    socialLinks: z.object({
        website: z.string().optional(),
        youtube: z.string().optional(),
        x: z.string().optional(),
    }),
});
