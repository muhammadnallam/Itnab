"use client";

import { useContext } from "react";
import Modal from "@/components/ui/Modal";
import Avatar from "@/components/ui/Avatar";
import RequireAuth from "@/components/RequireAuth";
import { useFollowers } from "@/hooks/useFollowers";
import { useFollowing } from "@/hooks/useFollowing";
import { useFollow } from "@/hooks/useFollow";
import { UserContext } from "@/context/UserContext";

function UserRow({ user }) {
    const { user: currentUser } = useContext(UserContext);
    const {
        isFollowing,
        toggle,
        isMutating,
    } = useFollow(user.id);
    const isSelf = currentUser?.id === user.id;

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(/\s+/);
        return parts.length > 1
            ? parts[0][0] + parts[1][0]
            : parts[0][0];
    };

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
            }}
        >
            <Avatar
                img={user.image}
                initials={getInitials(user.name)}
                size={40}
                bg="var(--color-accent)"
            />
            <span
                style={{
                    flex: 1,
                    fontSize: 15,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {user.name}
            </span>
            {!isSelf && (
                <RequireAuth>
                    <button
                        onClick={toggle}
                        className={
                            isFollowing
                                ? "bg-accent-light text-ink hover:bg-[#d0d0d0]"
                                : "bg-accent text-white hover:bg-accent-hover"
                        }
                        style={{
                            border: "none",
                            borderRadius: 99,
                            padding: "6px 16px",
                            fontSize: 13,
                            cursor: "pointer",
                            fontWeight: 500,
                            flexShrink: 0,
                            transition: "background 0.15s",
                        }}
                    >
                        {isFollowing ? "إلغاء المتابعة" : "متابعة"}
                    </button>
                </RequireAuth>
            )}
        </div>
    );
}

export default function FollowListModal({ open, onClose, type, userId }) {
    const isFollowers = type === "followers";
    const followersResult = useFollowers(userId, { enabled: open && isFollowers });
    const followingResult = useFollowing(userId, { enabled: open && !isFollowers });
    const { writers, loading } = isFollowers ? followersResult : followingResult;

    return (
        <Modal
            open={open}
            onClose={onClose}
            header={isFollowers ? "المتابعون" : "يتابع"}
            style={{ direction: "rtl" }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    maxHeight: "60vh",
                    overflowY: "auto",
                }}
            >
                {loading && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "24px 0",
                            color: "var(--color-mid)",
                            fontSize: 14,
                        }}
                    >
                        جاري التحميل...
                    </div>
                )}
                {!loading && writers.length === 0 && (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "24px 0",
                            color: "var(--color-mid)",
                            fontSize: 14,
                        }}
                    >
                        {isFollowers
                            ? "لا يوجد متابعون بعد"
                            : "لا يتابع أحدًا بعد"}
                    </div>
                )}
                {writers.map((w) => (
                    <UserRow key={w.id} user={w} />
                ))}
            </div>
        </Modal>
    );
}
