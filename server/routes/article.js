import { Router } from "express";
import prisma from "../lib/prisma.js";
import slugify from "../lib/slugify.js";
import validateArticle from "../middleware/validateArticle.js";

const router = Router();

router.post("/create", validateArticle, (req, res) => {
    const { validatedContent, articleData } = req;

    slugify("كيف تُطور مهاراتك في البرمجة بلغة بايثون؟", "مجتمع");

    res.status(200).json({ slug: "article.slug" });
});

export default router;
