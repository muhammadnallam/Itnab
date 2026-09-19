import { z } from "zod";
import { normalizeSocialUrl } from "@itnab/url";

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
    bio: z.string().max(500, "النبذة طويلة جدًا").nullable().optional(),
    image: z
        .union([z.string().url("رابط الصورة غير صالح"), z.literal("")])
        .nullable()
        .optional(),
    bannerUrl: z
        .union([z.string().url("رابط الصورة غير صالح"), z.literal("")])
        .nullable()
        .optional(),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z
        .string()
        .min(8, "كلمة المرور يجب أن تكون ٨ أحرف على الأقل")
        .max(64, "كلمة المرور يجب أن تكون ٦٤ حرفًا كحد أقصى"),
});

export const deleteAccountSchema = z.object({
    password: z
        .string({ error: "كلمة المرور مطلوبة" })
        .min(1, "كلمة المرور مطلوبة")
        .max(64, "كلمة المرور طويلة جدًا"),
});

export const checkEmailSchema = z.object({
    email: z.string().email("صيغة البريد الإلكتروني غير صحيحة"),
});

const socialLinkField = (platform) =>
    z
        .string()
        .max(300, "الرابط طويل جدًا")
        .refine(
            (value) => !normalizeSocialUrl(value, platform).error,
            { error: (issue) => normalizeSocialUrl(issue.input, platform).error },
        )
        .transform((value) => normalizeSocialUrl(value, platform).value ?? value)
        .optional()
        .nullable();

export const socialLinksSchema = z.object({
    socialLinks: z.object({
        website: socialLinkField("website"),
        youtube: socialLinkField("youtube"),
        x: socialLinkField("x"),
    }),
});

export const libraryQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});
