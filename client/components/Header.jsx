"use client";
import { useContext, useEffect, useRef, useState } from "react";
import { Bell, Search, Menu, SquarePen } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import UserDropdown from "@/components/UserDropdown";
import NotificationDropdown from "@/components/NotificationDropdown";
import { UserContext } from "@/context/UserContext";
import { useUnreadCount } from "@/hooks/useNotifications";
import { useMarkNotificationsRead } from "@/hooks/useMarkNotificationsRead";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
};

export default function Header({ onToggleSidebar, isMobile }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [headerSearch, setHeaderSearch] = useState("");
    const { user } = useContext(UserContext);
    const { unreadCount } = useUnreadCount();
    const { mutate: markAllRead } = useMarkNotificationsRead();
    const markTimer = useRef(null);
    const router = useRouter();
    const pathname = usePathname();
    const isExplore = pathname === "/explore";

    // Mark notifications as read shortly after the dropdown opens
    // (delayed so items render first).
    useEffect(() => {
        if (!notifOpen || !user || unreadCount === 0) return;
        markTimer.current = setTimeout(() => {
            markAllRead();
        }, 800);
        return () => clearTimeout(markTimer.current);
    }, [notifOpen, user, unreadCount, markAllRead]);

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
                {!isMobile && (
                    <button
                        onClick={onToggleSidebar}
                        className="text-mid hover:text-ink"
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            padding: 4,
                            transition: "color 0.15s",
                        }}
                    >
                        <Menu size={24}></Menu>
                    </button>
                )}
                <Link href="/">
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
                </Link>
                {isMobile && (
                    <button
                        onClick={() => router.push("/explore")}
                        className="text-mid hover:text-ink"
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            padding: 4,
                            transition: "color 0.15s",
                        }}
                    >
                        <Search size={22} />
                    </button>
                )}
            </div>

            {!isMobile && !isExplore && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--border-radius)",
                        padding: "8px 16px",
                        flex: 1,
                        maxWidth: 540,
                    }}
                >
                    <Search size={18} />
                    <input
                        placeholder="بحث"
                        value={headerSearch}
                        onChange={(e) => setHeaderSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && headerSearch.trim()) {
                                router.push(
                                    `/explore?q=${encodeURIComponent(headerSearch.trim())}&tab=articles`,
                                );
                                setHeaderSearch("");
                            }
                        }}
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
            )}

            <div style={{ display: "flex", gap: 16 }}>
                {user && (
                    <button
                        onClick={() => {
                            router.push("/new");
                        }}
                        className="text-mid hover:text-ink"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "none",
                            border: "none",
                            fontSize: 15,
                            cursor: "pointer",
                            flexShrink: 0,
                            transition: "color 0.15s",
                        }}
                    >
                        <SquarePen size={24} />
                        اكتب
                    </button>
                )}

                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => {
                            setNotifOpen((v) => !v);
                            setMenuOpen(false);
                        }}
                        aria-label="الإشعارات"
                        className="text-mid hover:text-ink"
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            padding: 4,
                            transition: "color 0.15s",
                        }}
                    >
                        <Bell size={24} />
                    </button>
                    {user && unreadCount > 0 && (
                        <span
                            style={{
                                position: "absolute",
                                top: -6,
                                insetInlineEnd: -6,
                                background: "var(--color-accent)",
                                color: "var(--color-white)",
                                fontSize: 11,
                                fontWeight: 700,
                                minWidth: 18,
                                height: 18,
                                borderRadius: 999,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0 5px",
                                pointerEvents: "none",
                            }}
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                    <NotificationDropdown
                        open={notifOpen}
                        onClose={() => setNotifOpen(false)}
                    />
                </div>

                <div style={{ position: "relative" }}>
                    <Avatar
                        img={user?.image}
                        initials={user?.name ? getInitials(user.name) : "?"}
                        size={34}
                        bg="var(--color-accent)"
                        onClick={() => {
                            setMenuOpen((v) => !v);
                            setNotifOpen(false);
                        }}
                    />
                    <UserDropdown
                        open={menuOpen}
                        onClose={() => setMenuOpen(false)}
                    />
                </div>
            </div>
        </header>
    );
}
