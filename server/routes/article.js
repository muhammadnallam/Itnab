import { Router } from "express";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import validateArticle from "../middleware/validateArticle.js";
import requireAuth from "../middleware/requireAuth.js";
import {
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
} from "../services/articleService.js";

const router = Router();

router.post(
    "/create",
    requireAuth,
    validateArticle,
    asyncErrorHandler(async (req, res) => {
        const { validatedContent, articleData } = req;
        const userId = req.user.id;

        const slug = await createArticle(validatedContent, articleData, userId);
        if (!slug) {
            return res.status(500).json({ error: "حدث خطأ أثناء نشر المقال" });
        }
        res.status(200).json({ slug });
    }),
);

router.get(
    "/read/:slug",
    asyncErrorHandler(async (req, res) => {
        const slug = req.params.slug;
        const article = await getArticle({ slug });
        if (!article) {
            return res.status(404).json({ error: "المقال غير موجود" });
        }
        res.json(article);
    }),
);

router.put(
    "/update/:id",
    requireAuth,
    validateArticle,
    asyncErrorHandler(async (req, res) => {
        const { validatedContent, articleData } = req;
        const userId = req.user.id;
        const articleId = req.params.id;

        if (!articleId) {
            return res.status(400).json({ error: "معرف المقال مطلوب" });
        }

        const article = await getArticle({ id: articleId });
        if (!article) {
            return res.status(404).json({ error: "المقال غير موجود" });
        }
        if (article.authorId !== userId) {
            return res
                .status(403)
                .json({ error: "ليس لديك صلاحية تعديل هذا المقال" });
        }

        await updateArticle(articleId, validatedContent, articleData, userId);
        res.status(200).json({ success: true });
    }),
);

router.delete(
    "/delete/:slug",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const slug = req.params.slug;
        const userId = req.user.id;

        if (!slug) {
            return res.status(400).json({ error: "معرف المقال مطلوب" });
        }

        const article = await getArticle({ slug });
        if (!article) {
            return res.status(404).json({ error: "المقال غير موجود" });
        }
        if (article.authorId !== userId) {
            return res
                .status(403)
                .json({ error: "ليس لديك صلاحية تعديل هذا المقال" });
        }

        await deleteArticle(article.id);
        res.status(200).json({ success: true });
    }),
);

export default router;
