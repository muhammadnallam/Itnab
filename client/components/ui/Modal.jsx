import { useEffect } from "react";
import { X } from "lucide-react";

const OVERLAY = "rgba(15,15,20,0.6)";

export default function Modal({ open, onClose, style, children }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

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
                    padding: 24,
                    direction: "rtl",
                    animation: "modalIn 0.18s ease",
                }}
            >
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 18,
                        left: 18,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-mid)",
                        display: "flex",
                        padding: 4,
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-ink)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                >
                    <X size={18} />
                </button>
                {children}
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
