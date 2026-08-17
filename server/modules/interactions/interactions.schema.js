import { z } from "zod";

export const reactionSchema = z.object({
    type: z.enum(["LIKE", "DISLIKE"]),
});

export const SHARE_PLATFORMS = [
    "copy",
    "x",
    "facebook",
    "linkedin",
    "whatsapp",
    "telegram",
    "email",
    "native",
];

export const platformSchema = z.object({
    platform: z.enum(SHARE_PLATFORMS),
});

export const saveSchema = z.object({
    listId: z.string().uuid().optional(),
});
