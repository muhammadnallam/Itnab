import { z } from "zod";

const draftFields = {
    content: z.record(z.any()),
    seoTitle: z.string().max(200).optional().nullable(),
    seoDescription: z.string().max(400).optional().nullable(),
    topic: z.string().max(60).optional().nullable(),
};

export const createDraftSchema = z.object({
    ...draftFields,
    articleId: z.string().uuid().optional().nullable(),
});

export const updateDraftSchema = z.object(draftFields);

export const draftsQuerySchema = z.object({
    articleId: z.string().uuid().optional(),
});
