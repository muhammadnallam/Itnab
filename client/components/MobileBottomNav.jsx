"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import {
    House,
    Inbox,
    Bookmark,
    UserRound,
    Search,
} from "lucide-react";
import { UserContext } from "@/context/UserContext";
import RequireAuth from "@/components/RequireAuth";

const MobileBottomNav = () => {
    const pathname = usePathname();
    const { user } = useContext(UserContext);
    const profileLink = user?.username ? `/@${user.username}` : "/auth";
    const items = [
        { icon: House, label: "الرئيسية", link: "/" },
        { icon: Inbox, label: "الاشتراكات", link: "/subscriptions", protected: true },
        { icon: Search, label: "استكشف", link: "/explore", protected: false },
        { icon: Bookmark, label: "المكتبة", link: "/library", protected: true },
        { icon: UserRound, label: "أنت", link: profileLink },
    ];
    return (
        <nav
            style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 60,
                background: "var(--color-white)",
                borderTop: "1px solid var(--color-border)",
                display: "flex",
                height: 56,
            }}
        >
            {items.map((item) => {
                const Icon = item.icon;
                const active =
                    item.label === "أنت"
                        ? pathname === `/@${user?.username}`
                        : pathname === item.link;
                const link = (
                    <Link
                        key={item.label}
                        href={item.link}
                        className={
                            active
                                ? "text-accent"
                                : "text-mid hover:text-ink"
                        }
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 13,
                            gap: 4,
                            textDecoration: "none",
                            transition: "color 0.15s",
                        }}
                    >
                        <Icon
                            size={22}
                            fill={active ? "var(--color-accent)" : "none"}
                            color={
                                active ? "var(--color-accent)" : "currentColor"
                            }
                        />
                        <span>{item.label}</span>
                    </Link>
                );
                return item.protected ? (
                    <RequireAuth key={item.label}>{link}</RequireAuth>
                ) : (
                    link
                );
            })}
        </nav>
    );
};

export default MobileBottomNav;