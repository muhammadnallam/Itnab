import { z } from "zod";
import { TAGS } from "@itnab/constants";

export const feedQuerySchema = z.object({
    sort: z.enum(["top", "new"]).default("top"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    author: z.string().uuid("معرف المؤلف غير صالح").optional(),
    topic: z.enum(TAGS).optional(),
    filter: z.enum(["subscriptions"]).optional(),
});

export const listsQuerySchema = z.object({
    author: z.string().uuid("معرف المؤلف غير صالح"),
    articleId: z.string().uuid("معرف المقال غير صالح").optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    q: z.string().trim().max(60, "الاسم طويل جدًا").optional(),
});

export const createListSchema = z.object({
    name: z.string().trim().min(1, "اسم القائمة مطلوب").max(60, "الاسم طويل جدًا"),
    isPrivate: z.boolean().optional().default(false),
});

export const updateListSchema = z.object({
    name: z.string().trim().min(1, "اسم القائمة مطلوب").max(60, "الاسم طويل جدًا"),
    isPrivate: z.boolean().optional(),
});
