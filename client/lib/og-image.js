const CLOUDINARY_HOSTNAME = "res.cloudinary.com";
const CLOUDINARY_UPLOAD = /\/image\/upload\//;
const OG_TRANSFORM = "c_fill,g_auto,w_1200,h_630,q_auto:good,f_jpg";

const FALLBACK_IMAGE = { url: "/logo.png", width: 912, height: 776 };

/**
 * Resolves the best available Open Graph image for an article cover.
 *
 * - Cloudinary covers are transformed into an optimized 1200x630 crop.
 * - Any other absolute http(s) URL is passed through untouched.
 * - Anything unusable falls back to the site logo.
 *
 * @param {string} coverImage - The stored cover image URL.
 * @param {string} alt - Alt text for the image (usually the article title).
 * @returns {{ url: string, width?: number, height?: number, alt: string }}
 */
export function resolveOgImage(coverImage, alt) {
    try {
        const parsed = new URL(coverImage);

        if (
            parsed.hostname === CLOUDINARY_HOSTNAME &&
            CLOUDINARY_UPLOAD.test(parsed.pathname)
        ) {
            parsed.pathname = parsed.pathname.replace(
                CLOUDINARY_UPLOAD,
                `/image/upload/${OG_TRANSFORM}/`,
            );
            return {
                url: parsed.toString(),
                width: 1200,
                height: 630,
                alt,
            };
        }

        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            return { url: coverImage, alt };
        }
    } catch {
        // Invalid URL, fall through to the fallback image.
    }

    return { ...FALLBACK_IMAGE, alt: "إطناب" };
}

export default resolveOgImage;
