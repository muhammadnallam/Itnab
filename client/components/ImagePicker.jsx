"use client";

import { useState } from "react";
import ImageCropModal from "@/components/ui/ImageCropModal";
import { useObjectUrl } from "@/hooks/useObjectUrl";
import {
    IMAGE_PRESETS,
    parseAspectRatio,
} from "@/lib/image-presets";

export default function ImagePicker({
    image,
    setImage,
    aspectRatio = "191/100",
    label = "إضافة صورة",
    changeLabel = "تغيير الصورة",
    maxSize = 3 * 1024 * 1024,
    error,
    setError,
    borderRadius = "var(--border-radius)",
    cropAspect,
    cropOutputWidth = IMAGE_PRESETS.cover.outputWidth,
    cropTitle = "قص الصورة",
}) {
    const [pendingFile, setPendingFile] = useState(null);
    const previewSrc = useObjectUrl(image);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;
        if (file.size > maxSize) {
            setError?.(`الحد الأقصى ${maxSize / 1024 / 1024} ميغابايت`);
            return;
        }
        setError?.("");
        setPendingFile(file);
    };

    const handleCropConfirm = (file) => {
        setPendingFile(null);
        if (file.size > maxSize) {
            setError?.(`الحد الأقصى ${maxSize / 1024 / 1024} ميغابايت`);
            return;
        }
        setError?.("");
        setImage(file);
    };

    return (
        <>
            {previewSrc && (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        maxWidth: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <img
                        src={previewSrc}
                        alt=""
                        style={{
                            width: "100%",
                            aspectRatio,
                            objectFit: "cover",
                            borderRadius,
                            display: "block",
                        }}
                    />
                </div>
            )}
            <label
                className={`${
                    error ? "text-error" : "text-mid"
                } border-b border-border hover:text-ink hover:border-ink`}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 0",
                    cursor: "pointer",
                    fontSize: 13,
                    transition: "color 0.15s, border-color 0.15s",
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                />
                {error || (image ? changeLabel : label)}
            </label>
            <ImageCropModal
                open={Boolean(pendingFile)}
                file={pendingFile}
                aspect={cropAspect ?? parseAspectRatio(aspectRatio)}
                title={cropTitle}
                outputWidth={cropOutputWidth}
                onCancel={() => setPendingFile(null)}
                onConfirm={handleCropConfirm}
            />
        </>
    );
}
