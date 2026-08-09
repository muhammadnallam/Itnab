import { useState } from "react";
import { Bookmark, Ellipsis } from "lucide-react";
import Avatar from "@/components/ui/Avatar";

export default function ListCard({ list, isMobile }) {
    const [saved, setSaved] = useState(false);

    /* The three images have descending widths to produce the depth illusion */
    const imgWidths = isMobile ? [88, 60, 44] : [110, 76, 56];
    const cardHeight = isMobile ? 88 : 110;

    return (
        <article
            style={{
                display: "flex",
                alignItems: "stretch",
                gap: 0,
                padding: "20px 0",
                borderBottom: "1px solid var(--color-border)",
                direction: "rtl",
            }}
        >
            {/* ── Content pane ───────────────────────────────────────── */}
            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    paddingLeft: 16
                }}
            >
                {/* Owner row */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 10,
                    }}
                >
                    <Avatar
                        initials={list.ownerAvatar}
                        size={20}
                        bg="var(--color-accent)"
                    />
                    <span
                        style={{
                            fontSize: 13,
                            color: "var(--color-ink)",
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {list.ownerName}
                    </span>
                </div>

                {/* List title */}
                <h3
                    style={{
                        fontFamily: "Georgia, 'Noto Serif Arabic', serif",
                        fontSize: isMobile ? 16 : 18,
                        fontWeight: 700,
                        color: "var(--color-ink)",
                        lineHeight: 1.3,
                        margin: "0 0 8px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {list.name}
                </h3>

                {/* Actions row */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Story count */}
                    <p
                        style={{
                            fontSize: 13,
                            color: "var(--color-light)",
                        }}
                    >
                        {list.storyCount} قصة
                    </p>
                    <div className="flex-1"></div>
                    <button
                        onClick={() => setSaved((s) => !s)}
                        className={`cursor-pointer pl-1 ${
                            saved ? "text-accent" : "text-mid hover:text-accent"
                        }`}
                        style={{ transition: "color 0.15s" }}
                    >
                        <Bookmark
                            size={19}
                            fill={saved ? "var(--color-accent)" : "none"}
                            color="currentColor"
                        />
                    </button>

                    <button
                        className="cursor-pointer text-mid ml-1 hover:text-ink"
                        style={{
                            transition: "color 0.15s",
                        }}
                    >
                        <Ellipsis size={19} />
                    </button>
                </div>
            </div>

            {/* ── Image strip (3 photos, descending widths) ─────────── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "stretch",
                    height: cardHeight,
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                {[0, 1, 2].map((i) => {
                    const src = list.images?.[i];
                    const w = imgWidths[i];

                    return (
                        <div
                            key={i}
                            style={{
                                width: w,
                                height: "100%",
                                flexShrink: 0,
                                background: "var(--color-surface-subtle)",
                                /* hairline separator between images */
                                borderRight:
                                    i > 0
                                        ? "2px solid var(--color-white, #fff)"
                                        : "none",
                                overflow: "hidden",
                            }}
                        >
                            {src ? (
                                <img
                                    src={src}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />
                            ) : (
                                /* placeholder when fewer than 3 images */
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        background:
                                            "var(--color-surface-subtle)",
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </article>
    );
}
