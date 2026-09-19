import { z } from "zod";
import {
    ARTICLE_REPORT_REASON_IDS,
    PROFILE_REPORT_REASON_IDS,
} from "@itnab/constants";

export const reportSchema = z
    .object({
        articleId: z.string().uuid("معرف المقال غير صالح").optional(),
        profileId: z.string().uuid("معرف المستخدم غير صالح").optional(),
        category: z.string().trim().min(1, "يرجى اختيار سبب الإبلاغ"),
        details: z
            .string()
            .trim()
            .max(500, "الحد الأقصى لسبب الإبلاغ هو 500 حرف")
            .optional(),
    })
    .superRefine((data, ctx) => {
        const hasArticle = Boolean(data.articleId);
        const hasProfile = Boolean(data.profileId);

        if (hasArticle === hasProfile) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "يجب تحديد المقال أو المستخدم للإبلاغ عنه",
            });
            return;
        }

        const allowed = hasArticle
            ? ARTICLE_REPORT_REASON_IDS
            : PROFILE_REPORT_REASON_IDS;

        if (!allowed.includes(data.category)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["category"],
                message: "سبب الإبلاغ غير صالح",
            });
            return;
        }

        if (data.category === "other" && !data.details) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["details"],
                message: "يرجى كتابة سبب الإبلاغ",
            });
        }
    });
