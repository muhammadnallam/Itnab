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
    <div
        style={{
            width: 232,
            transform: isOpen
                ? "translateX(0)"
                : "translateX(240px)",
            transition: "transform 0.3s ease",
            willChange: "transform",
        }}
    >
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
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            width: "100%",
                            padding: "12px 16px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: active
                                ? "var(--color-accent)"
                                : "var(--color-mid)",
                            fontSize: 15,
                            fontWeight: active ? 700 : 400,
                            borderRadius: 0,
                            marginBottom: 4,
                            textDecoration: "none",
                            textAlign: "right",
                            transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            if (!active) {
                                e.currentTarget.style.color =
                                    "var(--color-ink)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!active) {
                                e.currentTarget.style.color =
                                    "var(--color-mid)";
                            }
                        }}
                    >
                        <Icon
                            size={24}
                            fill={active ? "var(--color-accent)" : "none"}
                            color={
                                active
                                    ? "var(--color-accent)"
                                    : "var(--color-mid)"
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
