"use client";

const ArticleCardVerticalSkeleton = () => (
    <div style={{ display: "flex", flexDirection: "column" }}>
        <div
            style={{
                width: "100%",
                aspectRatio: "16/11",
                borderRadius: "var(--border-radius)",
                background: "var(--color-tag-bg)",
                marginBottom: 14,
                animation: "pulse 1.5s ease-in-out infinite",
            }}
        />
        <div
            style={{
                width: "80%",
                height: 16,
                borderRadius: 4,
                background: "var(--color-tag-bg)",
                marginBottom: 8,
                animation: "pulse 1.5s ease-in-out infinite",
            }}
        />
        <div
            style={{
                width: "50%",
                height: 12,
                borderRadius: 4,
                background: "var(--color-tag-bg)",
                animation: "pulse 1.5s ease-in-out infinite",
            }}
        />
    </div>
);

export default ArticleCardVerticalSkeleton;
