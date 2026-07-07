import {
    IcoHome,
    IcoInbox,
    IcoBookmark,
    IcoDash,
    IcoProfile,
    IcoMoreV,
} from "@/components/Icons";

const NAV_ITEMS = [
    { icon: IcoHome, label: "الرئيسية", active: true, link: "/" },
    {
        icon: IcoInbox,
        label: "الاشتراكات",
        active: false,
        link: "/subscriptions",
    },
    { icon: IcoBookmark, label: "مكتبتي", active: false, link: "/library" },
    { icon: IcoDash, label: "الإحصائيات", active: false, link: "/analytics" },
    {
        icon: IcoProfile,
        label: "الملف الشخصي",
        active: false,
        link: "/profile",
    },
];

const RightSidebar = ({ sidebarOpen, isActive } = {}) => (
    <div
        style={{
            width: 240,
            transform: sidebarOpen
                ? "translateX(0)"
                : "translateX(240px)",
            transition: "transform 0.3s ease",
            willChange: "transform",
        }}
    >
    <aside
        style={{
            display: isActive ? "flex" : "hidden",
            flexDirection: "column",
            padding: "24px 16px",
            height: "100%",
        }}
    >
        <nav style={{ flex: 1 }}>
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.label}
                        onClick={() => (window.location.href = item.link)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            width: "100%",
                            padding: "12px 16px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: item.active
                                ? "var(--color-accent)"
                                : "var(--color-mid)",
                            fontSize: 15,
                            fontWeight: item.active ? 700 : 400,
                            borderRadius: 0,
                            marginBottom: 4,
                            textAlign: "right",
                            transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            if (!item.active) {
                                e.currentTarget.style.color =
                                    "var(--color-ink)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!item.active) {
                                e.currentTarget.style.color =
                                    "var(--color-mid)";
                            }
                        }}
                    >
                        <Icon
                            size={22}
                            fill={item.active ? "var(--color-accent)" : "none"}
                        />
                        {item.label}
                    </button>
                );
            })}
        </nav>

        {/* TODO: More menu */}
        <div style={{ marginTop: 20 }}>
            <button
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    padding: "12px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-mid)",
                    fontSize: 15,
                    borderRadius: 0,
                    transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-ink)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-mid)")
                }
            >
                <IcoMoreV size={22} />
                المزيد
            </button>
        </div>
    </aside>
    </div>
);

export default RightSidebar;
