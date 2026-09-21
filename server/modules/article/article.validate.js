import { z } from "zod";
import { validateDoc } from "./article.schema.js";
import { sanitizeDoc } from "../../lib/sanitizeDoc.js";
import { TAGS } from "@itnab/constants";
import { ValidationError } from "../../lib/errors.js";

const VALID_TAGS = TAGS;

const articleSchema = z.object({
    content: z.record(z.any()),
    data: z.object({
        seoTitle: z.string().min(30).max(60),
        seoDescription: z.string().min(100).max(160),
        tag: z.enum(VALID_TAGS),
        sendEmail: z.boolean().optional(),
        coverImage: z.string().url(),
        wordCount: z.number().int().nonnegative(),
        publishTo: z.string().uuid("معرّف المستخدم غير صالح").optional(),
        originalDate: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ غير صحيحة")
            .refine(
                (value) =>
                    new Date(`${value}T12:00:00.000Z`).getTime() <=
                    Date.now() + 24 * 60 * 60 * 1000,
                { message: "التاريخ لا يمكن أن يكون في المستقبل" },
            )
            .optional(),
        listId: z.string().uuid("معرّف القائمة غير صالح").optional(),
        listName: z
            .string()
            .trim()
            .min(1, "اسم القائمة مطلوب")
            .max(60, "الاسم طويل جدًا")
            .optional(),
    })
        .refine((data) => !(data.listId && data.listName), {
            message: "لا يمكن تحديد قائمة موجودة وإنشاء قائمة جديدة معًا",
        }),
});

function validateArticle(req, res, next) {
    const parsed = articleSchema.safeParse(req.body);
    if (!parsed.success) {
        next(new ValidationError(parsed.error.issues[0].message));
        return;
    }

    const { content, data } = parsed.data;

    try {
        validateDoc(content);
    } catch (e) {
        next(new ValidationError("بُنية المستند غير صالحة"));
        return;
    }

    let sanitized;
    try {
        sanitized = sanitizeDoc(content);
    } catch (err) {
        next(new ValidationError(err.message));
        return;
    }

    req.validatedContent = sanitized;
    req.articleData = data;
    next();
}

export default validateArticle;
