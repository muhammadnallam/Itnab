export default function ApiMessage({ children, error = true, style }) {
    if (!children) {
        return;
    }
    return (
        <p
            style={{
                margin: "0 0 16px",
                padding: "8px 12px",
                fontSize: 13,
                color: error ? "var(--color-error)" : "var(--color-success)",
                background: error
                    ? "var(--color-error-light)"
                    : "var(--color-accent-light)",
                borderRadius: "var(--border-radius)",
                textAlign: "center",
                ...style,
            }}
        >
            {children}
        </p>
    );
}
