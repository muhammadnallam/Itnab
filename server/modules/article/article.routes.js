import { Router } from "express";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import validateArticle from "./article.validate.js";
import requireAuth from "../../middleware/requireAuth.js";
import {
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
} from "./article.service.js";

const router = Router();

router.post(
    "/create",
    requireAuth,
    validateArticle,
    asyncErrorHandler(async (req, res) => {
        const { validatedContent, articleData } = req;
        const slug = await createArticle(
            validatedContent,
            articleData,
            req.user.id,
        );
        res.status(200).json({ slug });
    }),
);

router.get(
    "/:slug/read",
    asyncErrorHandler(async (req, res) => {
        const article = await getArticle({ slug: req.params.slug });
        res.json(article);
    }),
);

router.put(
    "/:id/update",
    requireAuth,
    validateArticle,
    asyncErrorHandler(async (req, res) => {
        const { validatedContent, articleData } = req;
        await updateArticle(
            req.params.id,
            validatedContent,
            articleData,
            req.user.id,
        );
        res.status(200).json({ success: true });
    }),
);

router.delete(
    "/:id/delete",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        await deleteArticle(req.params.id, req.user.id);
        res.status(200).json({ success: true });
    }),
);

export default router;
