
import { IcoBell, IcoSearch } from "@/components/Icons";
import Avatar from "@/components/Avatar";  

const MobileHeader = ({ onLogin }) => (
    <header
        style={{
            position: "sticky",
            top: 0,
            zIndex: 60,
            background: "var(--color-white)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            height: 56,
            gap: 8,
        }}
    >
        <a href="/">
            <span
                style={{
                    fontFamily:
                        "var(--font-wordmark), 'Noto Serif Arabic', serif",
                    fontWeight: 700,
                    fontSize: 20,
                    transform: "scaleX(1.1)",
color: "var(--color-ink)",
                    letterSpacing: -0.5,
                    flexShrink: 0,
                }}
            >
                مَشْرَقَة
            </span>
        </a>

        <div style={{ flex: 1 }} />

        <button
            style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-mid)",
                display: "flex",
                padding: 4,
            }}
        >
            <IcoSearch size={20} />
        </button>

        <button
            style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-mid)",
                fontSize: 13,
                fontFamily: "inherit",
                padding: "4px 2px",
            }}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            اكتب
        </button>

        <button
            onClick={onLogin}
            style={{
                background: "none",
                border: "1px solid var(--color-border)",
                borderRadius: 99,
                padding: "5px 12px",
                fontSize: 12,
                fontFamily: "inherit",
                color: "var(--color-ink)",
                cursor: "pointer",
                fontWeight: 600,
                flexShrink: 0,
            }}
        >
            تسجيل الدخول
        </button>

        <button
            style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-mid)",
                display: "flex",
                position: "relative",
                padding: 4,
            }}
        >
            <IcoBell size={20} />
            <span
                style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                    border: "2px solid var(--color-white)",
                }}
            />
        </button>

        <Avatar initials="أن" size={28} bg="var(--color-accent)" />
    </header>
);

export default MobileHeader;