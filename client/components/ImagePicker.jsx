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
}) {
    return (
        <>
            {image && (
                <div
                    style={{
                        width: "100%",
                        maxWidth: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <img
                        src={
                            typeof image === "string"
                                ? image
                                : URL.createObjectURL(image)
                        }
                        alt=""
                        style={{
                            width: "100%",
                            aspectRatio,
                            objectFit: "cover",
                            borderRadius,
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
                    padding: "12px 0",
                    cursor: "pointer",
                    fontSize: 13,
                    color: error ? "var(--color-error, #c0392b)" : "var(--color-mid)",
                    borderBottom: "1px solid var(--color-border)",
                    transition: "color 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-ink)";
                    e.currentTarget.style.borderColor = "var(--color-ink)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = error ? "var(--color-error, #c0392b)" : "var(--color-mid)";
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
                        if (file.size > maxSize) {
                            setError(`الحد الأقصى ${maxSize / 1024 / 1024} ميغابايت`);
                            return;
                        }
                        setError("");
                        setImage(file);
                    }}
                />
                {error || (image ? changeLabel : label)}
            </label>
        </>
    );
}
