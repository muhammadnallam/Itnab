import { Router } from "express";
import prisma from "../lib/prisma.js";
import slugify from "../lib/slugify.js";
import validateArticle from "../middleware/validateArticle.js";
import requireAuth from "../middleware/requireAuth.js";
import { createArticle } from "../services/articleService.js";

const router = Router();
router.use(requireAuth)

router.post("/create", validateArticle, async (req, res) => {
    const { validatedContent, articleData } = req;

    const slug = await createArticle()

    res.status(200).json({ slug: "article.slug" });
});

export default router;
