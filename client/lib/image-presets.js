export const IMAGE_PRESETS = {
    avatar: { aspect: 1, outputWidth: 512, title: "قص الصورة الشخصية" },
    banner: { aspect: 1000 / 200, outputWidth: 2000, title: "قص صورة الغلاف" },
    cover: { aspect: 191 / 100, outputWidth: 1910, title: "قص صورة الغلاف" },
};

export function parseAspectRatio(value) {
    if (typeof value === "number") return value;
    const [w, h] = String(value)
        .split("/")
        .map((part) => Number(part.trim()));
    if (!w || !h) return 1;
    return w / h;
}
