function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("تعذر تحميل الصورة"));
        img.src = src;
    });
}

export async function getCroppedBlob(
    imageSrc,
    croppedAreaPixels,
    { maxWidth, type = "image/webp", quality = 0.92 } = {},
) {
    const image = await loadImage(imageSrc);
    const { x, y, width, height } = croppedAreaPixels;

    const scale =
        maxWidth && width > maxWidth ? maxWidth / width : 1;
    const outputWidth = Math.max(1, Math.round(width * scale));
    const outputHeight = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, x, y, width, height, 0, 0, outputWidth, outputHeight);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("تعذر قص الصورة"));
                    return;
                }
                resolve(blob);
            },
            type,
            quality,
        );
    });
}
