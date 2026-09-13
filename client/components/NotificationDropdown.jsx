"use client";

import { useContext, useEffect, useRef } from "react";
import { UserContext } from "@/context/UserContext";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationRow from "./notifications/NotificationRow";

function RowSkeleton() {
    return (
        <div
            style={{
                padding: "10px 12px",
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            <div
                className="flex items-center gap-2"
                style={{ marginBottom: 8 }}
            >
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "var(--color-tag-bg)",
                        animation: "pulse 1.5s ease-in-out infinite",
                    }}
                />
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "var(--color-tag-bg)",
                        animation: "pulse 1.5s ease-in-out infinite",
                    }}
                />
            </div>
            <div
                style={{
                    width: "90%",
                    height: 12,
                    borderRadius: 4,
                    background: "var(--color-tag-bg)",
                    animation: "pulse 1.5s ease-in-out infinite",
                    marginBottom: 6,
                }}
            />
            <div
                style={{
                    width: "60%",
                    height: 12,
                    borderRadius: 4,
                    background: "var(--color-tag-bg)",
                    animation: "pulse 1.5s ease-in-out infinite",
                }}
            />
        </div>
    );
}

const NotificationDropdown = ({ open, onClose, onNavigate }) => {
    const menuRef = useRef(null);
    const scrollRef = useRef(null);
    const sentinelRef = useRef(null);
    const { user } = useContext(UserContext);
    const {
        notifications,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useNotifications();

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

    useEffect(() => {
        if (!open || !hasNextPage) return;
        const el = sentinelRef.current;
        const root = scrollRef.current;
        if (!el || !root) return;
        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) fetchNextPage();
            },
            { root },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [open, hasNextPage, fetchNextPage, notifications.length]);

    if (!open) return null;

    const handleNavigate = () => {
        onNavigate?.();
        onClose();
    };

    return (
        <>
            <div
                style={{ position: "fixed", inset: 0, zIndex: 79 }}
                onClick={onClose}
            />
            <div
                ref={menuRef}
                className="card"
                style={{
                    position: "absolute",
                    top: "100%",
                    left: -45,
                    marginTop: 8,
                    width: "min(380px, 85vw)",
                    zIndex: 80,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                    padding: 8,
                }}
            >
                <div
                    ref={scrollRef}
                    style={{
                        maxHeight: "min(440px, 70vh)",
                        overflowY: "auto",
                    }}
                >
                    {!user ? (
                        <div
                            style={{
                                textAlign: "center",
                                color: "var(--color-mid)",
                                padding: 32,
                                fontSize: 14,
                            }}
                        >
                            سجّل الدخول لرؤية الإشعارات
                        </div>
                    ) : isLoading ? (
                        <>
                            <RowSkeleton />
                            <RowSkeleton />
                            <RowSkeleton />
                        </>
                    ) : notifications.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                color: "var(--color-mid)",
                                padding: 32,
                                fontSize: 14,
                            }}
                        >
                            لا توجد إشعارات بعد
                        </div>
                    ) : (
                        <>
                            {notifications.map((n, i) => (
                                <NotificationRow
                                    key={
                                        n?.id ??
                                        n?.groupKey ??
                                        `${i}`
                                    }
                                    notification={n}
                                    isLast={
                                        i === notifications.length - 1 &&
                                        !hasNextPage
                                    }
                                    currentUsername={user?.username}
                                    onNavigate={handleNavigate}
                                />
                            ))}
                            {hasNextPage && (
                                <div ref={sentinelRef}>
                                    {isFetchingNextPage && <RowSkeleton />}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationDropdown;
