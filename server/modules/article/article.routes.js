import { Router } from "express";
import { generateHTML } from "@tiptap/html";
import { extensions } from "@itnab/tiptap";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import validateArticle from "./article.validate.js";
import requireAuth from "../../middleware/requireAuth.js";
import { generateArticlePdf } from "../../lib/pdf.js";
import {
    createArticle,
    getArticle,
    updateArticle,
    deleteArticle,
} from "./article.service.js";
import { isAdmin } from "../../lib/admin.js";
import { AuthorizationError } from "../../lib/errors.js";

const router = Router();

router.post(
    "/create",
    requireAuth,
    validateArticle,
    asyncErrorHandler(async (req, res) => {
        const { validatedContent, articleData } = req;
        const admin = isAdmin(req.user);
        if (
            !admin &&
            (articleData.publishTo ||
                articleData.originalDate ||
                articleData.listId ||
                articleData.listName)
        ) {
            throw new AuthorizationError("ليس لديك صلاحية");
        }
        const slug = await createArticle(
            validatedContent,
            articleData,
            req.user.id,
            admin,
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
        const admin = isAdmin(req.user);
        if (
            !admin &&
            (articleData.publishTo ||
                articleData.originalDate ||
                articleData.listId ||
                articleData.listName)
        ) {
            throw new AuthorizationError("ليس لديك صلاحية");
        }
        await updateArticle(
            req.params.id,
            validatedContent,
            articleData,
            req.user.id,
            admin,
        );
        res.status(200).json({ success: true });
    }),
);

router.delete(
    "/:id/delete",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        await deleteArticle(req.params.id, req.user.id, isAdmin(req.user));
        res.status(200).json({ success: true });
    }),
);

router.get(
    "/:slug/pdf",
    asyncErrorHandler(async (req, res) => {
        const article = await getArticle({ slug: req.params.slug });

        const contentClone = JSON.parse(JSON.stringify(article.content));
        contentClone.content.splice(0, 2);
        const html = generateHTML(contentClone, extensions);

        const pdfBuffer = await generateArticlePdf({
            title: article.title,
            subtitle: article.subtitle,
            topic: article.topic,
            authorName: article.author.name,
            coverImage: article.coverImage,
            html,
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename*=UTF-8''${encodeURIComponent(article.slug)}.pdf`,
        );
        res.send(pdfBuffer);
    }),
);

export default router;
