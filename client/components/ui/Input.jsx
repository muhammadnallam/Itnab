export default function Input({
    type = "text",
    placeholder,
    value,
    label,
    onChange,
    rightIcon,
    autoFocus,
    name,
    id,
    required,
    minLength,
    autoComplete,
    error,
    style,
}) {
    const inputId = id || name;
    const errId = inputId ? `${inputId}-error` : undefined;
    return (
        <div>
            <div style={{ position: "relative" }}>
                {label && <label htmlFor={id}
                    style={{
                        display: "block",
                        fontSize: 13,
                        color: "var(--color-mid)",
                        marginBottom: 5,
                    }}
                >
                    {label}
                </label>}
                <input
                    type={type}
                    name={name}
                    id={inputId}
                    required={required}
                    minLength={minLength}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoFocus={autoFocus}
                    aria-invalid={!!error}
                    aria-describedby={error ? errId : undefined}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: rightIcon
                            ? "8px 48px 8px 10px"
                            : "8px 10px",
                        border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
                        borderRadius: 8,
                        fontSize: 15,
                        color: "var(--color-ink)",
                        background: "var(--color-white)",
                        outline: "none",
                        direction: "rtl",
                        transition: "border-color 0.2s",
                        ...style,
                    }}
                    onFocus={(e) => {
                        if (!error)
                            e.target.style.borderColor = "var(--color-accent)";
                    }}
                    onBlur={(e) => {
                        if (!error)
                            e.target.style.borderColor = "var(--color-border)";
                    }}
                />
                {rightIcon && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            right: 14,
                            transform: "translateY(-50%)",
                        }}
                    >
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p
                    id={errId}
                    role="alert"
                    style={{
                        margin: "8px 0 0",
                        fontSize: 13,
                        color: "var(--color-error)",
                        direction: "rtl",
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}
