import { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import {
    UserRound,
    Settings,
    LogOut,
    Sun,
    Monitor,
    Moon,
} from "lucide-react";

const navItems = {
    authed: [
        { icon: UserRound, label: "الملف الشخصي", href: "/profile" },
        { icon: Settings, label: "الإعدادات", href: "/settings" },
    ],
    guest: [],
};

const themeOptions = [
    { value: "light", label: "فاتح", icon: Sun },
    { value: "dark", label: "داكن", icon: Moon },
    { value: "system", label: "النظام", icon: Monitor },
];

const UserDropdown = ({ open, onClose, onLogin }) => {
    const menuRef = useRef(null);
    const user = useUser();
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKey);
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.removeEventListener("mousedown", handleClick);
        };
    }, [open, onClose]);

    const menuItems = user ? navItems.authed : navItems.guest;

    const handleItemClick = (item) => {
        if (item.href) {
            window.location.href = item.href;
            onClose();
            return;
        }
        onClose();
    };

    const handleLogout = () => {
        fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include",
        }).finally(() => {
            window.location.href = "/";
        });
        onClose();
    };

    const handleLogin = () => {
        onClose();
        onLogin && onLogin();
    };

    if (!open) return null;

    return (
        <>
            <div
                style={{ position: "fixed", inset: 0, zIndex: 79 }}
                onClick={onClose}
            />
            <div
                ref={menuRef}
                style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    marginTop: 8,
                    width: 260,
                    background: "var(--color-white)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 0,
                    zIndex: 80,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    padding: 8,
                    overflow: "hidden",
                }}
            >
                {user && (
                    <>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 12px",
                            }}
                        >
                            <div
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    flexShrink: 0,
                                    background: "var(--color-accent)",
                                    color: "var(--color-white)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 13,
                                    fontWeight: 500,
                                }}
                            >
                                من
                            </div>
                            <div style={{ minWidth: 0 }}>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: 15,
                                        fontWeight: 500,
                                        color: "var(--color-ink)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {user.name || user.username || "حسابي"}
                                </p>
                                {user.email && (
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: 13,
                                            color: "var(--color-mid)",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {user.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div
                            style={{
                                height: 1,
                                background: "var(--color-border)",
                                margin: "4px 0 8px",
                            }}
                        />
                    </>
                )}

                {!user && (
                    <button
                        onClick={handleLogin}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color =
                                "var(--color-accent)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color =
                                "var(--color-ink)";
                        }}
                        style={menuItemStyle()}
                    >
                        <UserRound size={18} stroke="var(--color-mid)" />
                        <span style={{ fontWeight: 500 }}>تسجيل الدخول</span>
                    </button>
                )}

                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.label}
                            onClick={() => handleItemClick(item)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color =
                                    "var(--color-accent)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color =
                                    "var(--color-ink)";
                            }}
                            style={menuItemStyle()}
                        >
                            <Icon size={18} stroke="var(--color-mid)" />
                            <span style={{ fontWeight: 500 }}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}

                <div
                    style={{
                        height: 1,
                        background: "var(--color-border)",
                        margin: "8px 0",
                    }}
                />

                <div style={{ padding: "8px 12px" }}>
                    <p
                        style={{
                            margin: "0 0 8px",
                            fontSize: 13,
                            color: "var(--color-mid)",
                        }}
                    >
                        المظهر
                    </p>
                    <div
                        role="radiogroup"
                        aria-label="اختيار المظهر"
                        style={{
                            display: "flex",
                            gap: 4,
                            background: "var(--color-accent-light)",
                            borderRadius: 999,
                            padding: 4,
                        }}
                    >
                        {themeOptions.map((opt) => {
                            const Icon = opt.icon;
                            const active = theme === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => setTheme(opt.value)}
                                    title={opt.label}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 4,
                                        border: "none",
                                        borderRadius: 999,
                                        padding: "8px 0",
                                        cursor: "pointer",
                                        fontSize: 13,
                                        fontWeight: 500,
                                        background: active
                                            ? "var(--color-accent)"
                                            : "transparent",
                                        color: active
                                            ? "var(--color-white)"
                                            : "var(--color-mid)",
                                        transition:
                                            "background 0.12s, color 0.12s",
                                    }}
                                >
                                    <Icon size={14} stroke="currentColor" />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {user && (
                    <>
                        <div
                            style={{
                                height: 1,
                                background: "var(--color-border)",
                                margin: "8px 0",
                            }}
                        />
                        <button
                            onClick={handleLogout}
                            style={{
                                ...menuItemStyle(),
                                color: "var(--color-error)",
                            }}
                        >
                            <LogOut size={18} stroke="var(--color-error)" />
                            <span style={{ fontWeight: 500 }}>
                                تسجيل الخروج
                            </span>
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

function menuItemStyle() {
    return {
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "8px 12px",
        border: "none",
        background: "none",
        cursor: "pointer",
        fontSize: 13,
        color: "var(--color-ink)",
        textAlign: "right",
        borderRadius: 0,
        transition: "color 0.12s",
    };
}

export default UserDropdown;
