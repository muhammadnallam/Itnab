const { z } = require("zod");
const { validateDoc } = require("../lib/editor-schema");
const { sanitizeDoc } = require("../lib/sanitize-doc");

const VALID_TAGS = [
    "تقنية",
    "علم النفس",
    "السياسة",
    "التاريخ",
    "الفلسفة",
    "الاقتصاد",
    "الأدب",
    "الفن",
    "الصحة",
    "ريادة الأعمال",
    "العلوم",
    "الثقافة",
];

const articleSchema = z.object({
    content: z.record(z.unknown()),
    data: z.object({
        seoTitle: z.string().min(1).max(60),
        seoDescription: z.string().min(1).max(160),
        tag: z.enum(VALID_TAGS),
        sendEmail: z.boolean().optional(),
    }),
});

function validateArticle(req, res, next) {
    const parsed = articleSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            error: parsed.error.issues[0].message,
        });
        return;
    }

    const { content, data } = parsed.data;

    try {
        validateDoc(content);
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: "Invalid document structure" });
        return;
    }

    let sanitized;
    try {
        sanitized = sanitizeDoc(content);
    } catch (err) {
        res.status(400).json({ error: err.message });
        return;
    }

    req.validatedContent = sanitized;
    req.articleData = data;
    next();
}

module.exports = validateArticle;
