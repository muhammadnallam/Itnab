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

const RightSidebar = (isActive) => (
    <aside
        style={{
            display: isActive ? "flex" : "hidden",
            flexDirection: "column",
            padding: "24px 18px",
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
                            gap: 14,
                            width: "100%",
                            padding: "12px 14px",
                            background: item.active
                                ? "var(--color-accent-light)"
                                : "none",
                            border: "none",
                            cursor: "pointer",
                            color: item.active
                                ? "var(--color-accent)"
                                : "var(--color-mid)",
                            fontSize: 15,
                            fontFamily: "inherit",
                            fontWeight: item.active ? 700 : 400,
                            borderRadius: 6,
                            marginBottom: 4,
                            textAlign: "right",
                            transition: "background 0.15s, color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            if (!item.active) {
                                e.currentTarget.style.background = "#f5f5f5";
                                e.currentTarget.style.color =
                                    "var(--color-ink)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!item.active) {
                                e.currentTarget.style.background = "none";
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
                    gap: 12,
                    width: "100%",
                    padding: "12px 14px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-mid)",
                    fontSize: 15,
                    fontFamily: "inherit",
                    borderRadius: 6,
                }}
            >
                <IcoMoreV size={22} />
                المزيد
            </button>
        </div>
    </aside>
);

export default RightSidebar;
