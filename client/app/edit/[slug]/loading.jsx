export default function Loading() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
            }}
        >
            <div
                style={{
                    width: 28,
                    height: 28,
                    border: "3px solid var(--color-border)",
                    borderTopColor: "var(--color-accent)",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                }}
            />
        </div>
    );
}
