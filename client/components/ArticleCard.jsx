import { useState } from "react";

import Avatar from "@/components/Avatar";
import { Heart, MessageSquare, Share, Bookmark, Ellipsis } from "lucide-react";

const ArticleCard = ({ article, isMobile }) => {
    const [saved, setSaved] = useState(false);

    return (
        <article
            style={{
                padding: "24px 0",
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            {/* TODO: Additional Information (Reason of recommendation / Reshared by ..) */}

            {/* Text + thumbnail row. The thumbnail is a flex sibling here,
                so it's fine for its width to be conditional on whether
                `article.image` exists — it only affects THIS row. */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Author row */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 10,
                        }}
                    >
                        <Avatar
                            initials={article.authorAvatar}
                            size={24}
                            bg="var(--color-accent)"
                        />
                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color: "var(--color-ink)",
                            }}
                        >
                            {article.author}
                        </span>
                        <span
                            style={{
                                color: "var(--color-light)",
                                fontSize: 13,
                            }}
                        >
                            ·
                        </span>
                        <span
                            style={{
                                fontSize: 13,
                                color: "var(--color-light)",
                            }}
                        >
                            {article.date}
                        </span>
                    </div>

                    {/* Title */}
                    <a href={`/article/${article.slug}`}>
                        <h2
                            style={{
                                fontSize: isMobile ? 17 : 20,
                                fontWeight: 600,
                                color: "var(--color-ink)",
                                lineHeight: 1.3,
                                marginBottom: 6,
                                cursor: "pointer",
                            }}
                        >
                            {article.title}
                        </h2>
                    </a>

                    {/* Excerpt */}
                    <p
                        style={{
                            fontSize: 14,
                            color: "var(--color-light)",
                            lineHeight: 1.7,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {article.excerpt}
                    </p>
                </div>

                {/* Thumbnail */}
                {article.image && (
                    <img
                        src={article.image}
                        alt=""
                        style={{
                            width: isMobile ? 88 : 120,
                            height: isMobile ? 88 : 120,
                            objectFit: "cover",
                            borderRadius: 4,
                            flexShrink: 0,
                        }}
                    />
                )}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginTop: 12,
                }}
            >
                {/* Read time pill */}
                <span
                    style={{
                        fontSize: 12,
                        color: "var(--color-ink)",
                        background: "var(--color-accent-light)",
                        borderRadius: 99,
                        padding: "3px 10px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                    }}
                >
                    {article.readTime} دقائق
                </span>

                {/* Claps */}
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-mid)",
                        fontSize: 12,
                        padding: 0,
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-accent)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                >
                    <Heart size={15} />
                    <span>{article.claps}</span>
                </button>

                {/* Comments */}
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-mid)",
                        fontSize: 12,
                        padding: 0,
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-accent)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                >
                    <MessageSquare size={15} />
                    <span>{article.comments}</span>
                </button>

                {/* Reposts */}
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-mid)",
                        fontSize: 12,
                        padding: 0,
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-accent)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                >
                    <Share size={15} />
                    <span>{article.reposts}</span>
                </button>

                <div style={{ flex: 1 }} />

                {/* Bookmark */}
                <button
                    onClick={() => setSaved((s) => !s)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 3,
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-accent)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                >
                    <Bookmark
                        size={15}
                        fill={saved ? "var(--color-accent)" : "none"}
                        color={saved ? "var(--color-accent)" : "var(--color-mid)"}
                    />
                </button>

                {/* More */}
                <button
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-mid)",
                        padding: 3,
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-accent)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                >
                    <Ellipsis size={15} />
                </button>
            </div>
        </article>
    );
};

export default ArticleCard;