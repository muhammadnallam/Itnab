import { isIP } from "node:net";
import { z } from "zod";

export const isPrivateHost = (hostname) => {
    const host = String(hostname || "")
        .toLowerCase()
        .replace(/^\[|\]$/g, "");
    if (!host) return true;
    if (host === "localhost" || host.endsWith(".localhost")) return true;
    if (host.endsWith(".local") || host.endsWith(".internal")) return true;

    const version = isIP(host);
    if (version === 4) {
        const [a, b] = host.split(".").map(Number);
        if (a === 0 || a === 10 || a === 127) return true;
        if (a === 169 && b === 254) return true;
        if (a === 172 && b >= 16 && b <= 31) return true;
        if (a === 192 && b === 168) return true;
        if (a === 100 && b >= 64 && b <= 127) return true;
        if (a >= 224) return true;
        return false;
    }
    if (version === 6) {
        if (host === "::" || host === "::1") return true;
        if (host.startsWith("fe80")) return true;
        if (host.startsWith("fc") || host.startsWith("fd")) return true;
        if (host.startsWith("::ffff:")) {
            const mapped = host.slice("::ffff:".length);
            if (isIP(mapped) === 4) return isPrivateHost(mapped);
        }
        return false;
    }
    return false;
};

export const isHttpsUrl = (value) => {
    if (typeof value !== "string" || value.length === 0) return false;
    let url;
    try {
        url = new URL(value);
    } catch {
        return false;
    }
    if (url.protocol !== "https:") return false;
    if (!url.hostname) return false;
    return !isPrivateHost(url.hostname);
};

const parseHost = (value) => {
    const url = new URL(value);
    return url.hostname.toLowerCase().replace(/^www\./, "");
};

export const optionalHttpsUrl = (message) =>
    z.preprocess(
        (value) => (value === "" ? null : value),
        z
            .union([z.null(), z.undefined(), z.string()])
            .refine((value) => value == null || isHttpsUrl(value), { message }),
    );

export const optionalHostUrl = (hosts, message) =>
    z.preprocess(
        (value) => (value === "" ? null : value),
        z
            .union([z.null(), z.undefined(), z.string()])
            .refine(
                (value) =>
                    value == null ||
                    (isHttpsUrl(value) && hosts.includes(parseHost(value))),
                { message },
            ),
    );

export const profileSchema = z.object({
    name: z.string().min(1, "الاسم مطلوب").optional(),
    username: z
        .string()
        .min(1, "اسم المستخدم مطلوب")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط",
        )
        .optional(),
    bio: z.string().nullable().optional(),
    image: optionalHttpsUrl("رابط الصورة غير صالح").optional(),
    bannerUrl: optionalHttpsUrl("رابط الغلاف غير صالح").optional(),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, "كلمة المرور الحالية مطلوبة"),
    newPassword: z
        .string()
        .min(8, "كلمة المرور يجب أن تكون ٨ أحرف على الأقل")
        .max(20, "كلمة المرور يجب أن تكون ٢٠ حرفًا كحد أقصى"),
});

export const socialLinksSchema = z.object({
    socialLinks: z.object({
        website: optionalHttpsUrl("رابط الموقع غير صالح").optional(),
        youtube: optionalHostUrl(
            ["youtube.com", "youtu.be", "m.youtube.com"],
            "رابط يوتيوب غير صالح",
        ).optional(),
        x: optionalHostUrl(
            ["x.com", "twitter.com"],
            "رابط إكس غير صالح",
        ).optional(),
    }),
});

export const libraryQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
});
