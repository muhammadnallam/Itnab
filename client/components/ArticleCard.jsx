import { useState } from "react";

import Avatar from "@/components/Avatar";
import {
    IcoClap,
    IcoComment,
    IcoShare,
    IcoBookmark,
    IcoMoreH,
} from "@/components/Icons";

const ArticleCard = ({ article, isMobile }) => {
    const [saved, setSaved] = useState(false);

    return (
        <article
            style={{
                padding: "22px 0",
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            {/* TODO: Additional Information (Reason of recommendation / Reshared by ..) */}
            {/* <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 12,
                }}
            >
                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-mid)"
                    strokeWidth="1.8"
                >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
                <span style={{ fontSize: 12, color: "var(--color-mid)" }}>
                    {article.reason}{" "}
                    <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>
                        {article.topic}
                    </span>
                </span>
            </div> */}

            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            marginBottom: 9,
                        }}
                    >
                        <Avatar
                            initials={article.authorAvatar}
                            size={22}
                            bg="var(--color-accent-med)"
                        />
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--color-ink)",
                            }}
                        >
                            {article.author}
                        </span>
                        {article.pub && (
                            <>
                                <span
                                    style={{ color: "var(--color-light)", fontSize: 12 }}
                                >
                                    في
                                </span>
                                <span
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    {article.pub.replace("في ", "")}
                                </span>
                            </>
                        )}
                        <span style={{ color: "var(--color-light)", fontSize: 12 }}>
                            ·
                        </span>
                        <span style={{ fontSize: 12, color: "var(--color-light)" }}>
                            {article.date}
                        </span>
                    </div>

                    <a href={`/article/${article.slug}`}>
                        <h2
                            style={{
                                fontFamily:
                                    "Georgia, 'Noto Serif Arabic', serif",
                                fontSize: isMobile ? 16 : 18,
                                fontWeight: 700,
                                color: "var(--color-ink)",
                                lineHeight: 1.35,
                                marginBottom: 7,
                                cursor: "pointer",
                            }}
                        >
                            {article.title}
                        </h2>
                    </a>

                    <p
                        style={{
                            fontSize: 14,
                            color: "var(--color-mid)",
                            lineHeight: 1.65,
                            marginBottom: 14,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {article.excerpt}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                        }}
                    >
                        <span
                            style={{
                                fontSize: 11,
                                color: "var(--color-mid)",
                                background: "var(--color-tag-bg)",
                                borderRadius: 99,
                                padding: "3px 9px",
                                whiteSpace: "nowrap",
                                flexShrink: 0,
                            }}
                        >
                            {article.readTime} دقائق
                        </span>

                        <button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--color-mid)",
                                fontSize: 13,
                                padding: 0,
                            }}
                        >
                            <IcoClap size={15} />
                            <span>{article.claps}</span>
                        </button>

                        <button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--color-mid)",
                                fontSize: 13,
                                padding: 0,
                            }}
                        >
                            <IcoComment size={15} />
                            <span>{article.comments}</span>
                        </button>

                        <button
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--color-mid)",
                                fontSize: 13,
                                padding: 0,
                            }}
                        >
                            <IcoShare size={15} />
                            <span>{article.reposts}</span>
                        </button>

                        <div style={{ flex: 1 }} />

                        <button
                            onClick={() => setSaved((s) => !s)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 4,
                                transition: "color 0.15s",
                            }}
                        >
                            <IcoBookmark size={15} fill={saved ? "var(--color-accent)" : "none"} />
                        </button>
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--color-mid)",
                                padding: 4,
                            }}
                        >
                            <IcoMoreH size={15} />
                        </button>
                    </div>
                </div>

                {article.image && (
                    <img
                        src={article.image}
                        alt=""
                        style={{
                            width: isMobile ? 80 : 110,
                            height: isMobile ? 80 : 110,
                            objectFit: "cover",
                            borderRadius: 4,
                            flexShrink: 0,
                        }}
                    />
                )}
            </div>
        </article>
    );
};

export default ArticleCard;
