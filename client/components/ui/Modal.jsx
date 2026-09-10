import { useEffect } from "react";
import { X } from "lucide-react";

const OVERLAY = "rgba(15,15,20,0.6)";

export default function Modal({ open, onClose, style, header, footer, onSubmit, children }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const hasStructure = header || footer;

    const body = (
        <>
            {hasStructure && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 24px",
                        borderBottom: header ? "1px solid var(--color-border)" : "none",
                    }}
                >
                    {typeof header === "string" ? (
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 18,
                                fontWeight: 600,
                                color: "var(--color-ink)",
                            }}
                        >
                            {header}
                        </h2>
                    ) : (
                        header
                    )}
                </div>
            )}
            <div
                style={{
                    overflowY: "auto",
                    scrollbarGutter: "stable",
                    padding: hasStructure ? 24 : undefined,
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    flex: 1,
                }}
            >
                {children}
            </div>
            {footer && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "16px 24px",
                        borderTop: "1px solid var(--color-border)",
                    }}
                >
                    {footer}
                </div>
            )}
        </>
    );

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: OVERLAY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                ...style,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 400,
                    background: "var(--color-white)",
                    borderRadius: "var(--border-radius)",
                    padding: hasStructure ? 0 : 24,
                    direction: "rtl",
                    animation: "modalIn 0.18s ease",
                    ...(hasStructure
                        ? { maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden" }
                        : {}),
                }}
            >
                {!hasStructure && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-mid hover:text-ink"
                        style={{
                            position: "absolute",
                            top: 18,
                            left: 18,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            padding: 4,
                            transition: "color 0.15s",
                        }}
                    >
                        <X size={18} />
                    </button>
                )}
                {hasStructure ? (
                    onSubmit ? (
                        <form
                            onSubmit={onSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                flex: 1,
                            }}
                        >
                            {body}
                        </form>
                    ) : (
                        body
                    )
                ) : (
                    children
                )}
            </div>
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(8px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
