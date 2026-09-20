import { Router } from "express";
import { Node as PMNode } from "prosemirror-model";
import { hasContent } from "@itnab/tiptap";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import requireAuth from "../../middleware/requireAuth.js";
import { draftLimiter } from "../../middleware/rateLimit.js";
import { ValidationError } from "../../lib/errors.js";
import { sanitizeDoc } from "../../lib/sanitizeDoc.js";
import { schema } from "../article/article.schema.js";
import {
    createDraftSchema,
    updateDraftSchema,
    draftsQuerySchema,
} from "./draft.schema.js";
import {
    listDrafts,
    getDraft,
    createDraft,
    updateDraft,
    deleteDraft,
} from "./draft.service.js";

const router = Router();

function sanitizeContent(content) {
    try {
        const doc = PMNode.fromJSON(schema, content);
        doc.check();
    } catch {
        throw new ValidationError("بُنية المسودة غير صالحة");
    }

    let sanitized;
    try {
        sanitized = sanitizeDoc(content);
    } catch (err) {
        throw new ValidationError(err.message);
    }

    if (!hasContent(sanitized)) {
        throw new ValidationError("لا يمكن حفظ مسودة فارغة");
    }

    return sanitized;
}

router.get(
    "/",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        const parsed = draftsQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        res.json(await listDrafts(req.user.id, parsed.data.articleId));
    }),
);

router.get(
    "/:id",
    requireAuth,
    asyncErrorHandler(async (req, res) => {
        res.json(await getDraft(req.params.id, req.user.id));
    }),
);

router.post(
    "/",
    requireAuth,
    draftLimiter,
    asyncErrorHandler(async (req, res) => {
        const parsed = createDraftSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        const { content, ...rest } = parsed.data;
        const draft = await createDraft(req.user.id, {
            ...rest,
            content: sanitizeContent(content),
        });
        res.status(201).json(draft);
    }),
);

router.put(
    "/:id",
    requireAuth,
    draftLimiter,
    asyncErrorHandler(async (req, res) => {
        const parsed = updateDraftSchema.safeParse(req.body);
        if (!parsed.success) {
            throw new ValidationError(parsed.error.issues[0].message);
        }
        const { content, ...rest } = parsed.data;
        const draft = await updateDraft(req.params.id, req.user.id, {
            ...rest,
            content: sanitizeContent(content),
        });
        res.json(draft);
    }),
);

router.delete(
    "/:id",
    requireAuth,
    draftLimiter,
    asyncErrorHandler(async (req, res) => {
        res.json(await deleteDraft(req.params.id, req.user.id));
    }),
);

export default router;
