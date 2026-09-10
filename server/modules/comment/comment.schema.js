import { z } from "zod";

export const createCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "التعليق فارغ")
        .max(2000, "التعليق طويل جدًا"),
    parentId: z.string().uuid("معرف التعليق غير صالح").optional(),
});

export const updateCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "التعليق فارغ")
        .max(2000, "التعليق طويل جدًا"),
});

export const commentsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
});
