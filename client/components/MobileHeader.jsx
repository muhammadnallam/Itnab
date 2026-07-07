import { useState } from "react";
import { IcoBell, IcoSearch } from "@/components/Icons";
import Avatar from "@/components/Avatar";
import UserDropdown from "@/components/UserDropdown";

const MobileHeader = ({ onLogin, isAuthenticated }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
    <header
        style={{
            position: "sticky",
            top: 0,
            zIndex: 60,
            background: "var(--color-white)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            height: 56,
            gap: 8,
        }}
    >
        <a href="/">
            <span
                style={{
                    fontWeight: 700,
                    fontSize: 19,
                    transform: "scaleX(1.1)",
                    color: "var(--color-ink)",
                    letterSpacing: -0.5,
                    flexShrink: 0,
                }}
            >
                إطناب
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
                transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-mid)")}
        >
            <IcoSearch size={22} />
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
                padding: "4px",
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
                strokeWidth="1.5"
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
                position: "relative",
                padding: 4,
                transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-mid)")}
        >
            <IcoBell size={22} />
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

        <div style={{ position: "relative" }}>
            <Avatar
                initials="أن"
                size={32}
                bg="var(--color-accent)"
                onClick={() => setMenuOpen((v) => !v)}
            />
            <UserDropdown
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                isAuthenticated={isAuthenticated}
                onLogin={onLogin}
            />
        </div>
    </header>
    );
};

export default MobileHeader;
