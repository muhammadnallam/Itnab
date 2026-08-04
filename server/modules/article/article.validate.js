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
        wordCount: z.number().int().positive(),
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

    if (data.wordCount < 500) {
        next(new ValidationError("يجب أن يحتوي المقال على 500 كلمة على الأقل"));
        return;
    }

    req.validatedContent = sanitized;
    req.articleData = data;
    next();
}

export default validateArticle;
