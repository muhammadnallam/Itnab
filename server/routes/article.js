import { Router } from "express";
import validateArticle from "../middleware/validateArticle.js";
import requireAuth from "../middleware/requireAuth.js";
import {
    createArticle,
    getArticleBySlug,
    getArticleById,
    updateArticle,
} from "../services/articleService.js";

const router = Router();

router.post("/create", requireAuth, validateArticle, async (req, res) => {
    const { validatedContent, articleData } = req;
    const userId = req.user.id;
    const slug = await createArticle(validatedContent, articleData, userId);
    res.status(200).json({ slug });
});

router.put("/update", requireAuth, validateArticle, async (req, res) => {
    const { validatedContent, articleData } = req;
    const userId = req.user.id;
    const { articleId } = req.body;

    if (!articleId) {
        return res.status(400).json({ error: "معرف المقال مطلوب" });
    }

    const article = await getArticleById(articleId);
    if (!article) {
        return res.status(404).json({ error: "المقال غير موجود" });
    }
    if (article.authorId !== userId) {
        return res.status(403).json({ error: "ليس لديك صلاحية تعديل هذا المقال" });
    }

    await updateArticle(articleId, validatedContent, articleData, userId);
    res.json({ success: true });
});

router.get("/:slug", async (req, res) => {
    const article = await getArticleBySlug(req.params.slug);
    if (!article) return res.status(404).json({ error: "المقال غير موجود" });
    res.json(article);
});

export default router;
