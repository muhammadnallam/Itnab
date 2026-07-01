
import {
    IcoHome,
    IcoInbox,
    IcoBookmark,
    IcoDash,
    IcoProfile,
} from "@/components/Icons";

const MobileBottomNav = () => {
    const items = [
        { icon: IcoHome, label: "الرئيسية", active: true },
        { icon: IcoInbox, label: "الاشتراكات", active: false },
        { icon: IcoBookmark, label: "المكتبة", active: false },
        { icon: IcoProfile, label: "الملف الشخصي", active: false },
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
                return (
                    <button
                        key={item.label}
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: item.active ? "var(--color-accent)" : "var(--color-mid)",
                            fontSize: 10,
                            fontFamily: "inherit",
                            gap: 3,
                        }}
                    >
                        <Icon
                            size={22}
                            fill={item.active ? "var(--color-accent)" : "none"}
                        />
                        <span>{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default MobileBottomNav;
