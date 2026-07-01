
import { IcoBell, IcoSearch } from "@/components/Icons";
import Avatar from "@/components/Avatar";

const DesktopHeader = () => (
    <header
        style={{
            position: "sticky",
            top: 0,
            zIndex: 70,
            background: "var(--color-white)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            height: 57,
            gap: 16,
        }}
    >
        <a href="/">
            <span
                style={{
                    fontFamily:
                        "var(--font-wordmark), 'Noto Serif Arabic', serif",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "var(--color-accent)",
                    letterSpacing: -0.5,
                    flexShrink: 0,
                    cursor: "pointer",
                    transform: "scaleX(1.1)",
                }}
            >
                مَشْرَقَة
            </span>
        </a>

        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: 99,
                padding: "7px 14px",
                flex: 1,
                maxWidth: 280,
            }}
        >
            <IcoSearch size={16} />
            <input
                placeholder="بحث"
                style={{
                    background: "none",
                    border: "none",
                    outline: "none",
                    fontSize: 14,
                    fontFamily: "inherit",
                    color: "var(--color-ink)",
                    width: "100%",
                    direction: "rtl",
                }}
            />
        </div>

        <div style={{ flex: 1 }} />

        <button
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "none",
                color: "var(--color-mid)",
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                flexShrink: 0,
                transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-mid)")}
        >
            <svg
                width="20"
                height="20"
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
            style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-mid)",
                display: "flex",
                padding: 4,
                transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-mid)")}
        >
            <IcoBell size={22} />
        </button>

        <Avatar initials="أن" size={34} bg="var(--color-accent)" />
    </header>
);

export default DesktopHeader;
