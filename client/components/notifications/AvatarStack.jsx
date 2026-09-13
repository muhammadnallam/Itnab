"use client";

import Avatar from "@/components/ui/Avatar";

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
};

export default function AvatarStack({ actors = [], total, max = 4 }) {
    const visible = actors.slice(0, max);
    const count = total ?? actors.length;
    const extra = Math.max(0, count - visible.length);

    if (visible.length === 0 && extra <= 0) return null;

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            {visible.map((a, i) => (
                <div
                    key={a?.id ?? a?.username ?? i}
                    style={{
                        marginInlineStart: i === 0 ? 0 : -10,
                        border: "2px solid var(--color-surface)",
                        borderRadius: "50%",
                    }}
                >
                    <Avatar
                        img={a?.image}
                        initials={a?.name ? getInitials(a.name) : "?"}
                        size={28}
                    />
                </div>
            ))}
            {extra > 0 && (
                <div
                    style={{
                        marginInlineStart: visible.length === 0 ? 0 : -10,
                        minWidth: 28,
                        height: 28,
                        borderRadius: 999,
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--color-mid)",
                        padding: "0 6px",
                    }}
                >
                    +{extra}
                </div>
            )}
        </div>
    );
}
