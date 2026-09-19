const INPUT_BASE = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    fontSize: 14,
    color: "var(--color-ink)",
    background: "var(--color-white)",
    outline: "none",
    boxSizing: "border-box",
};

export default function TextareaField({
    label,
    error,
    value = "",
    onChange,
    placeholder,
    min,
    max,
    minHeight = 80,
    maxLength,
    name,
    rows,
    style,
}) {
    const length = value.length;
    const counterColor =
        min != null
            ? length >= min && length <= max
                ? "var(--color-success)"
                : "var(--color-error)"
            : length > max
              ? "var(--color-error)"
              : "var(--color-mid)";

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                ...style,
            }}
        >
            {label && (
                <h3
                    style={{
                        margin: 0,
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--color-ink)",
                    }}
                >
                    {label}
                </h3>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <textarea
                    name={name}
                    rows={rows}
                    maxLength={maxLength}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={{
                        ...INPUT_BASE,
                        resize: "vertical",
                        minHeight,
                        fontFamily: "inherit",
                        lineHeight: 1.6,
                        ...(error
                            ? { border: "1px solid var(--color-error)" }
                            : {}),
                    }}
                />
                {max != null && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            fontSize: 12,
                            color: counterColor,
                        }}
                    >
                        {length}/{max}
                    </div>
                )}
            </div>
            {error && (
                <p
                    style={{
                        fontSize: 13,
                        color: "var(--color-error)",
                        margin: "6px 0 0",
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
