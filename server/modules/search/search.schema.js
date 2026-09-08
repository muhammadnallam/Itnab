import { z } from "zod";

export const searchQuerySchema = z.object({
    q: z.string().trim().min(1, "البحث مطلوب").max(100),
    tab: z.enum(["articles", "authors"]).optional(),
    limit: z.coerce.number().int().min(1).max(20).default(20),
});
