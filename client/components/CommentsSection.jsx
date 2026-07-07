import { useState } from "react";
import { Heart, MessageSquare, Ellipsis } from "lucide-react";

import Avatar from "./Avatar";

const CommentsSection = ({ responses, count }) => {
    const [text, setText] = useState("");

    return (
        <section style={{ marginTop: 64 }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 24,
                }}
            >
                <h3
                    style={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: "var(--color-ink)",
                    }}
                >
                    التعليقات ({count})
                </h3>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-mid)"
                    strokeWidth="1.5"
                >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 32,
                }}
            >
                <Avatar initials="أن" size={36} bg="var(--color-accent)" />
                <div style={{ flex: 1 }}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="ما رأيك؟"
                        rows={1}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            border: "1px solid var(--color-border)",
                            borderRadius: 0,
                            fontSize: 15,
                            background: "var(--color-bg)",
                            color: "var(--color-ink)",
                            outline: "none",
                            direction: "rtl",
                            resize: "none",
                            boxSizing: "border-box",
                            transition: "border-color 0.2s",
                        }}
                        onFocus={(e) => {
                            e.target.rows = 3;
                            e.target.style.borderColor = "var(--color-accent)";
                        }}
                        onBlur={(e) => {
                            if (!text) {
                                e.target.rows = 1;
                            }
                            e.target.style.borderColor = "var(--color-border)";
                        }}
                    />
                    {text && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-left",
                                gap: 8,
                                marginTop: 8,
                            }}
                        >
                            <button
                                onClick={() => setText("")}
                                style={{
                                    background: "none",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 99,
                                    padding: "8px 16px",
                                    fontSize: 13,
                                    color: "var(--color-mid)",
                                    cursor: "pointer",
                                    transition:
                                        "border-color 0.15s, color 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "var(--color-accent)";
                                    e.currentTarget.style.color =
                                        "var(--color-ink)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "var(--color-border)";
                                    e.currentTarget.style.color =
                                        "var(--color-mid)";
                                }}
                            >
                                إلغاء
                            </button>
                            <button
                                style={{
                                    background: "var(--color-accent)",
                                    color: "var(--color-white)",
                                    border: "none",
                                    borderRadius: 99,
                                    padding: "8px 16px",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "filter 0.15s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.filter =
                                        "brightness(1.15)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.filter =
                                        "brightness(1)")
                                }
                            >
                                نشر
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div
                style={{
                    height: 1,
                    background: "var(--color-border)",
                    marginBottom: 24,
                }}
            />

            {responses.map((r) => (
                <div key={r.id} style={{ marginBottom: 32 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 12,
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <Avatar
                                initials={r.avatar}
                                size={36}
                                bg="var(--color-accent-med)"
                            />
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: 15,
                                    fontWeight: 500,
                                    color: "var(--color-ink)",
                                }}
                            >
                                {r.author}
                            </div>
                            <div
                                style={{
                                    fontSize: 13,
                                    color: "var(--color-gold)",
                                }}
                            >
                                {r.date}
                            </div>
                        </div>
                        <div style={{ flex: 1 }} />
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--color-mid)",
                                transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                    "var(--color-ink)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                    "var(--color-mid)")
                            }
                        >
                            <Ellipsis size={16} />
                        </button>
                    </div>

                    {r.quote && (
                        <div
                            style={{
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-border)",
                                borderRadius: 0,
                                padding: "12px 16px",
                                marginBottom: 12,
                                fontSize: 15,
                                color: "var(--color-mid)",
                                lineHeight: 1.65,
                                fontStyle: "italic",
                            }}
                        >
                            {r.quote}
                        </div>
                    )}

                    <p
                        style={{
                            fontSize: 15,
                            color: "var(--color-ink)",
                            lineHeight: 1.8,
                            marginBottom: 12,
                        }}
                    >
                        {r.text}
                    </p>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--color-mid)",
                                    display: "flex",
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-accent)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-mid)")
                                }
                            >
                                <Heart size={16} />
                            </button>
                            <span
                                style={{
                                    fontSize: 13,
                                    color: "var(--color-mid)",
                                }}
                            >
                                {r.claps}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--color-mid)",
                                    display: "flex",
                                    transition: "color 0.15s",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-accent)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.color =
                                        "var(--color-mid)")
                                }
                            >
                                <MessageSquare size={16} />
                            </button>
                            <span
                                style={{
                                    fontSize: 13,
                                    color: "var(--color-mid)",
                                }}
                            >
                                {r.replies} ردود
                            </span>
                        </div>
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: 13,
                                color: "var(--color-accent)",
                                fontWeight: 500,
                                transition: "color 0.15s",
                                padding: 0,
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                    "var(--color-accent-hover)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                    "var(--color-accent)")
                            }
                        >
                            ردّ
                        </button>
                    </div>

                    <div
                        style={{
                            height: 1,
                            background: "var(--color-border)",
                            marginTop: 24,
                        }}
                    />
                </div>
            ))}
        </section>
    );
};

export default CommentsSection;
