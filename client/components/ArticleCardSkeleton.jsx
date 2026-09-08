"use client";

const ArticleCardSkeleton = ({ isMobile }) => (
    <article
        style={{
            padding: "24px 0",
            borderBottom: "1px solid var(--color-border)",
        }}
    >
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                    }}
                >
                    <div
                        style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "var(--color-tag-bg)",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    />
                    <div
                        style={{
                            width: 80,
                            height: 12,
                            borderRadius: 4,
                            background: "var(--color-tag-bg)",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    />
                    <div
                        style={{
                            width: 50,
                            height: 12,
                            borderRadius: 4,
                            background: "var(--color-tag-bg)",
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    />
                </div>
                <div
                    style={{
                        width: "90%",
                        height: isMobile ? 17 : 20,
                        borderRadius: 4,
                        background: "var(--color-tag-bg)",
                        marginBottom: 8,
                        animation: "pulse 1.5s ease-in-out infinite",
                    }}
                />
                <div
                    style={{
                        width: "60%",
                        height: 14,
                        borderRadius: 4,
                        background: "var(--color-tag-bg)",
                        animation: "pulse 1.5s ease-in-out infinite",
                    }}
                />
            </div>
            <div
                style={{
                    width: isMobile ? 88 : 120,
                    height: isMobile ? 88 : 120,
                    borderRadius: "var(--border-radius)",
                    background: "var(--color-tag-bg)",
                    flexShrink: 0,
                    animation: "pulse 1.5s ease-in-out infinite",
                }}
            />
        </div>
    </article>
);

export default ArticleCardSkeleton;
