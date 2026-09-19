"use client";

import { useContext } from "react";
import Modal from "@/components/ui/Modal";
import AuthorRow from "@/components/AuthorRow";
import { useFollowers } from "@/hooks/useFollowers";
import { useFollowing } from "@/hooks/useFollowing";
import { UserContext } from "@/context/UserContext";

export default function FollowListModal({ open, onClose, type, userId }) {
    const isFollowers = type === "followers";
    const { user: currentUser } = useContext(UserContext);
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
                    <AuthorRow
                        key={w.id}
                        author={w}
                        isSelf={currentUser?.id === w.id}
                    />
                ))}
            </div>
        </Modal>
    );
}
