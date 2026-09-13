"use client";

import { useState } from "react";
import { Heart, MessageCircle, UserPlus } from "lucide-react";
import { formatRelativeTime } from "@/lib/format-date";
import AvatarStack from "./AvatarStack";

const displayName = (a) =>
    a?.name || (a?.username ? `@${a.username}` : "مستخدم");

const norm = (v) => String(v ?? "").toUpperCase();

function getActors(n) {
    if (Array.isArray(n?.actors) && n.actors.length) return n.actors;
    if (n?.actor) return [n.actor];
    return [];
}

function isFollowType(t) {
    return t === "FOLLOW" || t === "FOLLOWED" || t === "NEW_FOLLOWER";
}

function isReplyNotif(n, t) {
    return (
        t === "REPLY" ||
        t === "COMMENT_REPLY" ||
        (t === "COMMENT" && norm(n?.targetType) === "COMMENT")
    );
}

function isCommentType(t) {
    return t === "COMMENT" || t === "NEW_COMMENT";
}

function isLikeType(t) {
    return (
        t === "LIKE" ||
        t === "NEW_LIKE" ||
        t === "ARTICLE_LIKE" ||
        t === "REACTION" ||
        t === ""
    );
}

function Name({ children }) {
    return <strong style={{ fontWeight: 600 }}>{children}</strong>;
}

function buildMainText(n, actors, count) {
    const t = norm(n?.type);
    const names = actors.map(displayName);
    const first = names[0] ?? "مستخدم";
    const second = names[1];
    const title = n?.article?.title || "مقالك";
    const preview = n?.commentPreview;

    if (isFollowType(t)) {
        if (count <= 1)
            return (
                <>
                    <Name>{first}</Name> بدأ بمتابعتك
                </>
            );
        if (count === 2 && second)
            return (
                <>
                    <Name>{first}</Name> و<Name>{second}</Name> بدآ بمتابعتك
                </>
            );
        return (
            <>
                <Name>{first}</Name>، <Name>{second ?? "آخر"}</Name> و
                {count - 2} آخرون بدأوا بمتابعتك
            </>
        );
    }

    if (isReplyNotif(n, t)) {
        return (
            <>
                <Name>{first}</Name> رد على تعليقك
                {preview ? `: «${preview}»` : ""}
            </>
        );
    }

    if (isCommentType(t)) {
        return (
            <>
                <Name>{first}</Name> علّق على «{title}»
                {preview ? `: «${preview}»` : ""}
            </>
        );
    }

    if (isLikeType(t)) {
        if (count <= 1)
            return (
                <>
                    <Name>{first}</Name> أعجب بـ«{title}»
                </>
            );
        if (count === 2 && second)
            return (
                <>
                    <Name>{first}</Name> و<Name>{second}</Name> أعجبا بمقالك «
                    {title}»
                </>
            );
        return (
            <>
                <Name>{first}</Name>، <Name>{second ?? "آخر"}</Name> و
                {count - 2} آخرون أعجبوا بمقالك «{title}»
            </>
        );
    }

    // Unknown types: generic fallback
    return (
        <>
            <Name>{first}</Name>
            {title ? ` — «${title}»` : ""}
            {preview ? `: «${preview}»` : ""}
        </>
    );
}

export function resolveNotificationTarget(n, currentUsername) {
    const t = norm(n?.type);
    const count = n?.count ?? getActors(n).length ?? 0;
    const slug = n?.article?.slug;

    if (isFollowType(t)) {
        if (count === 1) {
            const actors = getActors(n);
            const username =
                actors[0]?.username ?? n?.actor?.username ?? null;
            if (username) return `/@${username}`;
        }
        return currentUsername ? `/@${currentUsername}` : null;
    }

    if (!slug) return null;
    if ((isCommentType(t) || isReplyNotif(n, t)) && n?.commentId)
        return `/article/${slug}#comment-${n.commentId}`;
    return `/article/${slug}`;
}

function TypeIcon({ notif }) {
    const t = norm(notif?.type);
    const Icon = isFollowType(t)
        ? UserPlus
        : isCommentType(t) || isReplyNotif(notif, t)
          ? MessageCircle
          : Heart;
    return <Icon size={16} style={{ color: "var(--color-accent)" }} />;
}

export default function NotificationRow({
    notification: n,
    isLast = false,
    currentUsername,
    onNavigate,
}) {
    const [hover, setHover] = useState(false);
    if (!n) return null;

    const actors = getActors(n);
    const count = n?.count ?? actors.length ?? 0;
    const unread = !n?.readAt;
    const previewText = n?.commentPreview || n?.article?.title || "";
    const time = n?.updatedAt || n?.createdAt;

    const handleClick = () => {
        const href = resolveNotificationTarget(n, currentUsername);
        if (href) window.location.assign(href);
        onNavigate?.();
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: "block",
                width: "100%",
                background: hover ? "var(--color-bg)" : "none",
                border: "none",
                borderBottom: isLast
                    ? "none"
                    : "1px solid var(--color-border)",
                padding: "10px 12px",
                cursor: "pointer",
                textAlign: "start",
            }}
        >
            {/* line1: type icon + avatars + unread dot */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                }}
            >
                <span
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background:
                            "color-mix(in srgb, var(--color-accent) 12%, var(--color-surface))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <TypeIcon notif={n} />
                </span>
                <AvatarStack actors={actors} total={count} />
                {unread && (
                    <span
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "var(--color-accent)",
                            marginInlineStart: "auto",
                            flexShrink: 0,
                        }}
                    />
                )}
            </div>
            {/* line2: main text + time */}
            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "var(--color-ink)",
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    {buildMainText(n, actors, count)}
                </p>
                {time && (
                    <span
                        style={{
                            fontSize: 12,
                            color: "var(--color-mid)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                        }}
                    >
                        {formatRelativeTime(time)}
                    </span>
                )}
            </div>
            {/* line3: preview */}
            {previewText ? (
                <p
                    style={{
                        margin: "2px 0 0",
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "var(--color-mid)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {previewText}
                </p>
            ) : null}
        </button>
    );
}
