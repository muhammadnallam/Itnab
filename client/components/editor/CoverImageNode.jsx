export default function CoverImage({
    coverImage,
    setCoverImage,
    setCoverError,
}) {
    return (
        <>
            {coverImage && (
                <div
                    style={{
                        padding: "3rem 3rem 24px",
                        maxWidth: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <img
                        src={
                            typeof coverImage === "string"
                                ? coverImage
                                : URL.createObjectURL(coverImage)
                        }
                        alt=""
                        style={{
                            width: "100%",
                            aspectRatio: "191/100",
                            objectFit: "cover",
                            borderRadius: 8,
                        }}
                    />
                </div>
            )}
            <label
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 3rem",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "var(--color-mid)",
                    borderBottom: "1px solid var(--color-border)",
                    margin: "0 3rem 0",
                    transition: "color 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-ink)";
                    e.currentTarget.style.borderColor = "var(--color-ink)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-mid)";
                    e.currentTarget.style.borderColor = "var(--color-border)";
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 3 * 1024 * 1024) {
                            setCoverError("الحد الأقصى 3 ميغابايت");
                            return;
                        }
                        setCoverError("");
                        setCoverImage(file);
                    }}
                />
                {coverImage ? "تغيير صورة الغلاف" : "إضافة صورة غلاف"}
            </label>
        </>
    );
}
