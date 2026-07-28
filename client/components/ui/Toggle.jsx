export default function Toggle({ checked, onChange }) {
    return (
        <button
            onClick={() => onChange(!checked)}
            style={{
                width: 44,
                height: 24,
                borderRadius: 99,
                background: checked
                    ? "var(--color-accent)"
                    : "var(--color-mid)",
                border: "none",
                cursor: "pointer",
                position: "relative",
                flexShrink: 0,
                transition: "background 0.2s",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 3,
                    left: checked ? 23 : 3,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "var(--color-white)",
                    transition: "left 0.2s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
            />
        </button>
    );
}
