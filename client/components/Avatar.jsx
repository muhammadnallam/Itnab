const Avatar = ({
    initials,
    size = 32,
    bg = "var(--color-mid)",
    color = "var(--color-white)",
    onClick,
}) => (
    <div
        onClick={onClick}
        style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: bg,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.34,
            fontWeight: 700,
            flexShrink: 0,
            userSelect: "none",
            cursor: "pointer",
        }}
    >
        {/* TODO: Add avatar image or icon */}
        {initials}
    </div>
);

export default Avatar;
