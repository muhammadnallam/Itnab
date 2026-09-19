const MAX_LENGTH = 300;

const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;

const HOSTNAME_PATTERN = /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

const PLATFORMS = {
    website: {
        hosts: null,
        canonicalHost: null,
        error: "الرابط غير صالح",
    },
    youtube: {
        hosts: [
            "youtube.com",
            "www.youtube.com",
            "m.youtube.com",
            "youtu.be",
        ],
        canonicalHost: "youtube.com",
        error: "الرابط يجب أن يكون رابط يوتيوب صالحًا",
    },
    x: {
        hosts: [
            "x.com",
            "www.x.com",
            "twitter.com",
            "www.twitter.com",
            "mobile.twitter.com",
        ],
        canonicalHost: "x.com",
        error: "الرابط يجب أن يكون رابط X صالحًا",
    },
};

function parse(raw) {
    const trimmed = String(raw ?? "").trim();
    if (!trimmed) return null;
    if (trimmed.length > MAX_LENGTH) throw new Error("too long");

    const candidate = HAS_SCHEME.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
    const url = new URL(candidate);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("unsupported scheme");
    }
    if (url.username || url.password) {
        throw new Error("credentials not allowed");
    }

    return url;
}

/**
 * Validates and normalizes a social/website link.
 *
 * @param {string} raw - The raw value entered by the user.
 * @param {"website" | "youtube" | "x"} platform - The field the link belongs to.
 * @returns {{ value: string } | { error: string }}
 */
export function normalizeSocialUrl(raw, platform) {
    const config = PLATFORMS[platform];
    if (!config) return { error: "منصة غير معروفة" };

    let url;
    try {
        url = parse(raw);
    } catch {
        return { error: config.error };
    }

    if (url === null) return { value: "" };

    const hostname = url.hostname.toLowerCase();

    if (config.hosts) {
        if (!config.hosts.includes(hostname)) {
            return { error: config.error };
        }
    } else if (!HOSTNAME_PATTERN.test(hostname)) {
        return { error: config.error };
    }

    if (hostname === "youtu.be") {
        const id = url.pathname.replace(/^\/+/, "").split("/")[0];
        if (!id) return { error: config.error };
        url.hostname = "youtube.com";
        url.pathname = "/watch";
        url.search = `?v=${encodeURIComponent(id)}`;
    } else if (config.canonicalHost) {
        url.hostname = config.canonicalHost;
    }

    return { value: url.href };
}

export default normalizeSocialUrl;
