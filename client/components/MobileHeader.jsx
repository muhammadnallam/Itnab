import { useState } from "react";
import { Bell, Search, SquarePen } from "lucide-react";
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
                        fontFamily: "var(--font-wordmark)",
                        fontWeight: 400,
                        fontSize: 28,
                        transform: "scaleX(1.1)",
                        color: "var(--color-ink)",
                        letterSpacing: -0.5,
                        flexShrink: 0,
                    }}
                >
                    إطناب
                </span>
            </a>

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
                onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-ink)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-mid)")
                }
            >
                <Search size={22} />
            </button>

            <div style={{ flex: 1 }} />
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
                onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-ink)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-mid)")
                }
            >
                <SquarePen size={22} />
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
                onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-ink)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-mid)")
                }
            >
                <Bell size={22} />
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
