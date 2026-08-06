import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    Inbox,
    Bookmark,
    ChartColumn,
    UserRound,
    Ellipsis,
} from "lucide-react";

const NAV_ITEMS = [
    { icon: House, label: "الرئيسية", link: "/" },
    { icon: Inbox, label: "الاشتراكات", link: "/subscriptions" },
    { icon: Bookmark, label: "مكتبتي", link: "/library" },
    { icon: ChartColumn, label: "الإحصائيات", link: "/analytics" },
    { icon: UserRound, label: "حسابي", link: "/profile" },
];

const RightSidebar = ({ isOpen, isActive } = {}) => {
    const pathname = usePathname();

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
                        const active = pathname === item.link;
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
                                    fontWeight: active ? 700 : 400,
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
