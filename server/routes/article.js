const router = require("express").Router();
const crypto = require("crypto");
const prisma = require("../lib/prisma");
const validateArticle = require("../middleware/validateArticle");

router.post("/create", validateArticle, async (req, res) => {
    const { validatedContent, articleData } = req;

    // TODO: Generate slug

    // TODO: Add to DB

    res.status(200).json({ slug: "article.slug" });
});

module.exports = router;
