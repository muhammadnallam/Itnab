"use client";
import { useState } from "react";
import { Bell, Search, Menu, SquarePen } from "lucide-react";
import Avatar from "@/components/Avatar";
import UserDropdown from "@/components/UserDropdown";
import { useUser } from "@/context/UserContext";

const DesktopHeader = ({ isAuthenticated, onLogin, onToggleSidebar }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const user = useUser();

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 70,
                background: "var(--color-white)",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                height: 57,
                gap: 16,
            }}
        >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <button
                    onClick={onToggleSidebar}
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
                    <Menu size={24}></Menu>
                </button>
                <a href="/">
                    <span
                        style={{
                            fontFamily: "var(--font-wordmark)",
                            fontWeight: 400,
                            fontSize: 28,
                            color: "var(--color-accent)",
                            letterSpacing: -0.5,
                            flexShrink: 0,
                            cursor: "pointer",
                            transform: "scaleX(1.1)",
                        }}
                    >
                        إطناب
                    </span>
                </a>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "var(--color-bg)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 99,
                    padding: "8px 16px",
                    flex: 1,
                    maxWidth: 540,
                }}
            >
                <Search size={18} />
                <input
                    placeholder="بحث"
                    style={{
                        background: "none",
                        border: "none",
                        outline: "none",
                        fontSize: 14,
                        color: "var(--color-ink)",
                        width: "100%",
                        direction: "rtl",
                    }}
                />
            </div>

            {/* <div style={{ flex: 1 }} /> */}

            <div style={{ display: "flex", gap: 16 }}>
                {user && (
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "none",
                            border: "none",
                            color: "var(--color-mid)",
                            fontSize: 15,
                            cursor: "pointer",
                            flexShrink: 0,
                            transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "var(--color-ink)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "var(--color-mid)")
                        }
                    >
                        <SquarePen size={24} />
                        اكتب
                    </button>
                )}

                <button
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-mid)",
                        display: "flex",
                        padding: 4,
                        transition: "color 0.15s",
                        marginTop: 1,
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-ink)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                >
                    <Bell size={24} />
                </button>

                <div style={{ position: "relative" }}>
                    <Avatar
                        initials="من"
                        size={34}
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
            </div>
        </header>
    );
};

export default DesktopHeader;
