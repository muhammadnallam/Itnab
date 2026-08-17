"use client";

import { useEffect, useRef, useState } from "react";
import { useShare } from "@/hooks/useShare";
import { SHARE_PLATFORMS, openShare } from "@/lib/share";

const MENU_STYLE = {
    position: "absolute",
    top: "calc(100% + 8px)",
    insetInlineEnd: 0,
    zIndex: 80,
    width: 220,
    padding: 8,
};

const ITEM_STYLE = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "9px 12px",
    border: "none",
    background: "none",
    borderRadius: "var(--border-radius)",
    cursor: "pointer",
    fontSize: 14,
    color: "var(--color-ink)",
    transition: "background 0.15s",
};

export default function ShareMenu({ articleId, url, children }) {
    const { share } = useShare(articleId);
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("keydown", handleKey);
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.removeEventListener("mousedown", handleClick);
        };
    }, [open]);

    const handleSelect = (platform) => {
        setOpen(false);
        const target = url || window.location.href;
        openShare(platform, target);
        share(platform);
    };

    return (
        <div ref={menuRef} style={{ position: "relative" }}>
            <div onClick={() => setOpen((o) => !o)}>{children}</div>
            {open && (
                <div className="card" style={MENU_STYLE}>
                    {SHARE_PLATFORMS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => handleSelect(p.id)}
                            style={ITEM_STYLE}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                    "var(--color-bg)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "none")
                            }
                        >
                            <p.icon size={18} strokeWidth={1.75} />
                            <span>{p.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}