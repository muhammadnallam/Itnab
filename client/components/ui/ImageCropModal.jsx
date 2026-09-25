"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { getCroppedBlob } from "@/lib/crop-image";
import { useObjectUrl } from "@/hooks/useObjectUrl";

function CropBody({ file, aspect, outputWidth, onCancel, onConfirm }) {
    const src = useObjectUrl(file);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [areaPixels, setAreaPixels] = useState(null);
    const [busy, setBusy] = useState(false);

    const handleConfirm = async () => {
        if (!areaPixels || busy) return;
        setBusy(true);
        try {
            const blob = await getCroppedBlob(src, areaPixels, {
                maxWidth: outputWidth,
            });
            const cropped = new File([blob], "crop.webp", {
                type: blob.type || "image/webp",
            });
            onConfirm(cropped);
        } catch {
            setBusy(false);
        }
    };

    return (
        <>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: 320,
                    background: "#000",
                    borderRadius: "var(--border-radius)",
                    overflow: "hidden",
                }}
            >
                {src && (
                    <Cropper
                        image={src}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(_, pixels) => setAreaPixels(pixels)}
                    />
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 16,
                }}
            >
                <span
                    style={{
                        fontSize: 13,
                        color: "var(--color-mid)",
                        flexShrink: 0,
                    }}
                >
                    تكبير
                </span>
                <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "var(--color-accent)" }}
                />
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 12,
                    justifyContent: "center",
                    marginTop: 20,
                }}
            >
                <Button
                    onClick={onCancel}
                    variant="secondary"
                    disabled={busy}
                    style={{ width: "50%" }}
                >
                    إلغاء
                </Button>
                <Button
                    onClick={handleConfirm}
                    loading={busy}
                    style={{ width: "50%" }}
                >
                    حفظ
                </Button>
            </div>
        </>
    );
}

export default function ImageCropModal({
    open,
    file,
    aspect = 1,
    title = "قص الصورة",
    outputWidth,
    onCancel,
    onConfirm,
}) {
    return (
        <Modal open={open} onClose={onCancel}>
            <h2
                style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--color-ink)",
                    margin: "0 0 16px",
                }}
            >
                {title}
            </h2>
            {file && (
                <CropBody
                    key={file}
                    file={file}
                    aspect={aspect}
                    outputWidth={outputWidth}
                    onCancel={onCancel}
                    onConfirm={onConfirm}
                />
            )}
        </Modal>
    );
}
