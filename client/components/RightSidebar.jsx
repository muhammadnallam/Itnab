"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import {
    House,
    Inbox,
    Bookmark,
    ChartColumn,
    UserRound,
    Ellipsis,
} from "lucide-react";
import { UserContext } from "@/context/UserContext";

const BASE_NAV_ITEMS = [
    { icon: House, label: "الرئيسية", link: "/" },
    { icon: Inbox, label: "الاشتراكات", link: "/subscriptions" },
    { icon: Bookmark, label: "مكتبتي", link: "/library" },
    { icon: ChartColumn, label: "الإحصائيات", link: "/analytics" },
];

const RightSidebar = ({ isOpen, isActive } = {}) => {
    const pathname = usePathname();
    const { user } = useContext(UserContext);
    const profileLink = user?.username ? `/@${user.username}` : "/auth";
    const NAV_ITEMS = [
        ...BASE_NAV_ITEMS,
        { icon: UserRound, label: "حسابي", link: profileLink },
    ];

    return (
        <div>
            <aside
                style={{
                    display: isActive !== false ? "flex" : "none",
                    flexDirection: "column",
                    padding: "24px 16px",
                    height: "100%",
                }}
            >
                <nav style={{ flex: 1 }}>
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active =
                            item.label === "حسابي"
                                ? pathname === `/profile/${user?.username}`
                                : pathname === item.link;
                        return (
                            <Link
                                key={item.label}
                                href={item.link}
                                className={
                                    active
                                        ? "text-accent"
                                        : "text-mid hover:text-ink"
                                }
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    width: "100%",
                                    padding: "12px 16px",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: 15,
                                    fontWeight: active ? 500 : 400,
                                    borderRadius: 0,
                                    marginBottom: 4,
                                    textDecoration: "none",
                                    textAlign: "right",
                                    transition: "color 0.15s",
                                }}
                            >
                                <Icon
                                    size={24}
                                    fill={
                                        active ? "var(--color-accent)" : "none"
                                    }
                                    color={
                                        active
                                            ? "var(--color-accent)"
                                            : "currentColor"
                                    }
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </div>
    );
};

export default RightSidebar;