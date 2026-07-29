export default function Button({
    children,
    onClick,
    variant = "primary", // primary / secondary / dark / error
    disabled = false,
    loading = false,
    style,
    ...rest
}) {
    return (
        <>
            <button
                onClick={onClick}
                disabled={disabled || loading}
                style={{
                    display: "block",
                    background:
                        disabled || loading
                            ? "var(--color-disabled-bg)"
                            : variant === "secondary"
                              ? "var(--color-bg)"
                              : variant === "dark"
                                ? "var(--color-dark-surface)"
                                : variant === "error"
                                  ? "var(--color-error)"
                                  : "var(--color-accent)",
                    color:
                        disabled || loading
                            ? "var(--color-disabled-txt)"
                            : variant === "secondary"
                              ? "var(--color-ink)"
                              : "var(--color-white)",
                    border:
                        variant === "error"
                            ? "1px solid var(--color-error)"
                            : "none",
                    borderRadius: "var(--border-radius)",
                    padding: "8px 10px",
                    fontSize: 15,
                    cursor: loading
                        ? "wait"
                        : !disabled
                          ? "pointer"
                          : "not-allowed",
                    transition: "background 0.2s, color 0.2s",
                    ...style,
                }}
                {...rest}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.filter =
                        !disabled && !loading ? "brightness(0.9)" : "none")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.filter = "brightness(1)")
                }
            >
                {loading ? (
                    <span
                        style={{
                            display: "inline-block",
                            width: 18,
                            height: 18,
                            border: "2px solid currentColor",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 0.6s linear infinite",
                        }}
                    />
                ) : (
                    children
                )}
            </button>
        </>
    );
}
