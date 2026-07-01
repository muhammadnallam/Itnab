import { useState } from "react";
import { IcoClap, IcoComment, IcoMoreH } from "./Icons";

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
                    marginBottom: 28,
                }}
            >
                <h3
                    style={{
                        fontFamily: "Georgia, 'Noto Serif Arabic', serif",
                        fontSize: 22,
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
                    strokeWidth="1.8"
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
                            padding: "10px 14px",
                            border: "1px solid var(--color-border)",
                            borderRadius: 6,
                            fontSize: 14,
                            fontFamily: "inherit",
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
                                    padding: "6px 16px",
                                    fontSize: 13,
                                    fontFamily: "inherit",
                                    color: "var(--color-mid)",
                                    cursor: "pointer",
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
                                    padding: "6px 16px",
                                    fontSize: 13,
                                    fontFamily: "inherit",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                نشر
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ height: 1, background: "var(--color-border)", marginBottom: 28 }} />

            {responses.map((r) => (
                <div key={r.id} style={{ marginBottom: 32 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 12,
                        }}
                    >
                        <div style={{ position: "relative" }}>
                            <Avatar initials={r.avatar} size={36} bg="var(--color-accent-med)" />
                        </div>
                        <div>
                            <div
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: "var(--color-ink)",
                                }}
                            >
                                {r.author}
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
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
                            }}
                        >
                            <IcoMoreH size={16} />
                        </button>
                    </div>

                    {r.quote && (
                        <div
                            style={{
                                background: "var(--color-bg)",
                                border: "1px solid var(--color-border)",
                                borderRadius: 6,
                                padding: "14px 16px",
                                marginBottom: 12,
                                fontFamily:
                                    "Georgia, 'Noto Serif Arabic', serif",
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
                            lineHeight: 1.7,
                            marginBottom: 14,
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
                                gap: 5,
                            }}
                        >
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--color-mid)",
                                    display: "flex",
                                }}
                            >
                                <IcoClap size={16} />
                            </button>
                            <span style={{ fontSize: 13, color: "var(--color-mid)" }}>
                                {r.claps}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                            }}
                        >
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--color-mid)",
                                    display: "flex",
                                }}
                            >
                                <IcoComment size={16} />
                            </button>
                            <span style={{ fontSize: 13, color: "var(--color-mid)" }}>
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
                                fontFamily: "inherit",
                                fontWeight: 600,
                                padding: 0,
                            }}
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