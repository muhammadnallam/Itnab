import "dotenv/config";
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import requireAuth from "../../middleware/requireAuth.js";
import asyncErrorHandler from "../../middleware/asyncErrorHandler.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
    // keeps uploaded file as a buffer in memory
    storage: multer.memoryStorage(),
    limits: { fileSize: 3 * 1024 * 1024 },
});

const router = Router();

router.post(
    "/:folder",
    requireAuth,
    upload.single("file"),
    asyncErrorHandler(async (req, res) => {
        const folder = req.params.folder || "";
        if (!req.file) {
            return res.status(400).json({ error: "الملف مطلوب" });
        }

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: `itnab/${folder}` },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                },
            );
            uploadStream.end(req.file.buffer);
        });

        res.json({ url: result.secure_url });
    }),
);

export default router;
