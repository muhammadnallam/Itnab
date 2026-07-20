import "dotenv/config";
import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import requireAuth from "../middleware/requireAuth";

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

router.post("/:folder", requireAuth, upload.single("file"), async (req, res) => {
    const folder = req.params.folder || "";
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, error: "No file provided" });
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

        res.json({ success: true, url: result.secure_url });
    } catch (err) {
        res.status(500).json({ success: false, error: "Upload failed" });
    }
});

export default router;
