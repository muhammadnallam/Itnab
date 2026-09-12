"use client";

import { useContext } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import RequireAuth from "@/components/RequireAuth";
import { useFollow } from "@/hooks/useFollow";
import { UserContext } from "@/context/UserContext";

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
};

export default function AuthorRow({ author, isSelf = false }) {
    const { user } = useContext(UserContext);
    const { isFollowing, toggle } = useFollow(author.id);

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
            }}
        >
            <Link href={`/@${author.username}`} className="flex items-center gap-2">
                <Avatar
                    img={author.image}
                    initials={getInitials(author.name)}
                    size={40}
                    bg="var(--color-accent)"
                />
                <span
                    className="hover:underline"
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
                    {author.name}
                </span>
            </Link>
            {user && !isSelf && (
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
                        {isFollowing ? "متابِع" : "متابعة"}
                    </button>
                </RequireAuth>
            )}
        </div>
    );
}
