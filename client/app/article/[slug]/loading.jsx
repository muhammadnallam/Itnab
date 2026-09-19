export default function Loading() {
    return (
        <main className="article-page overflow-x-hidden">
            <div
                style={{
                    maxWidth: 720,
                    margin: "0 auto",
                    padding: "48px 24px",
                }}
            >
                <div
                    style={{
                        height: 34,
                        width: "70%",
                        borderRadius: 6,
                        background: "var(--color-tag-bg)",
                        marginBottom: 16,
                        animation: "pulse 1.5s ease-in-out infinite",
                    }}
                />
                <div
                    style={{
                        height: 18,
                        width: "40%",
                        borderRadius: 6,
                        background: "var(--color-tag-bg)",
                        marginBottom: 40,
                        animation: "pulse 1.5s ease-in-out infinite",
                    }}
                />
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        style={{
                            height: 14,
                            width: i % 2 ? "100%" : "85%",
                            borderRadius: 4,
                            background: "var(--color-tag-bg)",
                            marginBottom: 12,
                            animation: "pulse 1.5s ease-in-out infinite",
                        }}
                    />
                ))}
            </div>
        </main>
    );
}
