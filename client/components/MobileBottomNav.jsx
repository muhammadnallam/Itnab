import {
    House,
    Inbox,
    Bookmark,
    UserRound,
} from "lucide-react";

const MobileBottomNav = () => {
    const items = [
        { icon: House, label: "الرئيسية", active: true },
        { icon: Inbox, label: "الاشتراكات", active: false },
        { icon: Bookmark, label: "المكتبة", active: false },
        { icon: UserRound, label: "أنت", active: false },
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
                        className={
                            item.active
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
                            transition: "color 0.15s",
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
