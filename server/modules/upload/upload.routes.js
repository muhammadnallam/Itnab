import "dotenv/config";
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import requireAuth from "../../middleware/requireAuth.js";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";
import { uploadLimiter } from "../../middleware/rateLimit.js";
import { ValidationError } from "../../lib/errors.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Server-side allowlist of destination buckets. The client can only select a
// logical bucket name, never a raw path -> prevents path traversal and
// namespace abuse in the shared Cloudinary account.
const ALLOWED_FOLDERS = new Set([
    "article-assets",
    "article-covers",
    "avatars",
    "banners",
]);

// Accepted image MIME types. SVG is deliberately excluded: it can carry
// <script> and would be served by Cloudinary as executable image/svg+xml.
const ALLOWED_MIME = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);

// Detect the real type from the file signature (magic bytes).
// Content-Type from multipart/extension are attacker-controlled and untrusted.
function sniffMime(buf) {
    if (!buf || buf.length < 12) return null;
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)
        return "image/jpeg";
    if (
        buf[0] === 0x89 &&
        buf[1] === 0x50 &&
        buf[2] === 0x4e &&
        buf[3] === 0x47 &&
        buf[4] === 0x0d &&
        buf[5] === 0x0a &&
        buf[6] === 0x1a &&
        buf[7] === 0x0a
    )
        return "image/png";
    const head6 = buf.toString("ascii", 0, 6);
    if (head6 === "GIF87a" || head6 === "GIF89a") return "image/gif";
    if (
        buf.toString("ascii", 0, 4) === "RIFF" &&
        buf.toString("ascii", 8, 12) === "WEBP"
    )
        return "image/webp";
    if (buf.toString("ascii", 4, 12) === "ftypavif") return "image/avif";
    return null;
}

const upload = multer({
    // In-memory only: no file ever hits the server filesystem.
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024, files: 1 },
    // First gate: reject obviously disallowed declared types.
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME.has(file.mimetype)) {
            return cb(new Error("UNSUPPORTED_MEDIA_TYPE"));
        }
        cb(null, true);
    },
});

// Wrap multer so its errors become a clean 400 instead of a 500.
function uploadSingle(req, res, next) {
    upload.single("file")(req, res, (err) => {
        if (err) {
            const message =
                err.message === "UNSUPPORTED_MEDIA_TYPE"
                    ? "نوع الملف غير مدعوم"
                    : "ملف غير صالح";
            return next(new ValidationError(message));
        }
        next();
    });
}

const router = Router();

router.post(
    "/:folder",
    requireAuth,
    uploadLimiter,
    uploadSingle,
    asyncErrorHandler(async (req, res) => {
        const { folder } = req.params;

        // Gate 2: folder allowlist.
        if (!ALLOWED_FOLDERS.has(folder)) {
            throw new ValidationError("مجلد غير مسموح");
        }
        if (!req.file) {
            throw new ValidationError("الملف مطلوب");
        }

        // Gate 3: verify actual bytes, not the declared MIME.
        const detected = sniffMime(req.file.buffer);
        if (!detected || !ALLOWED_MIME.has(detected)) {
            throw new ValidationError("نوع الملف غير مدعوم");
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `itnab/${folder}`,
                    // Constrain delivery server-side as defense in depth.
                    resource_type: "image",
                    allowed_formats: [
                        "jpg",
                        "jpeg",
                        "png",
                        "webp",
                        "gif",
                        "avif",
                    ],
                    // Never trust or preserve the client filename.
                    use_filename: false,
                    unique_filename: true,
                    overwrite: false,
                },
                (error, uploadResult) =>
                    error ? reject(error) : resolve(uploadResult),
            );
            uploadStream.end(req.file.buffer);
        });

        res.json({ url: result.secure_url });
    }),
);

export default router;
