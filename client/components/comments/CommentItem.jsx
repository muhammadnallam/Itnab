"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import RequireAuth from "@/components/RequireAuth";
import ConfirmModal from "@/components/ConfirmModal";
import MoreMenu from "@/components/MoreMenu";
import CommentComposer from "./CommentComposer";
import {
    ThumbsUp,
    Trash2,
    MessageSquare,
    Pencil,
    CircleAlert,
    Ellipsis,
} from "lucide-react";
import { formatRelativeTime } from "@/lib/format-date";

function renderContent(content) {
    if (!content) return null;
    const match = content.match(/^@(\S+)\s/);
    if (!match) {
        return <span style={{ whiteSpace: "pre-wrap" }}>{content}</span>;
    }
    const username = match[1];
    const rest = content.slice(match[0].length);
    return (
        <span style={{ whiteSpace: "pre-wrap" }}>
            <Link
                href={`/@${username}`}
                style={{
                    color: "var(--color-accent)",
                    textDecoration: "none",
                    fontWeight: 600,
                }}
            >
                @{username}
            </Link>{" "}
            {rest}
        </span>
    );
}

export default function CommentItem({
    comment,
    articleAuthorId,
    articleId,
    currentUserId,
    onDelete,
    onEdit,
    onLike,
    onReply,
    repliesExpanded = false,
    onToggleReplies,
    onReplyPosted,
}) {
    const [replyOpen, setReplyOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(comment.content);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const isOwner = comment.author?.id === currentUserId;
    const avatarSize = 36;

    const handleSave = () => {
        if (!editedContent.trim()) return;
        onEdit({ commentId: comment.id, content: editedContent });
        setEditing(false);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditedContent(comment.content);
    };

    const handleDelete = async () => {
        setConfirmLoading(true);
        try {
            onDelete(comment.id);
        } finally {
            setConfirmLoading(false);
            setConfirmOpen(false);
        }
    };

    const menuOptions = isOwner
        ? [
              {
                  icon: Pencil,
                  label: "تعديل",
                  onClick: () => {
                      setEditing(true);
                      setEditedContent(comment.content);
                  },
              },
              { separator: true },
              {
                  icon: Trash2,
                  label: "حذف",
                  type: "red",
                  onClick: () => setConfirmOpen(true),
              },
          ]
        : [
              {
                  icon: CircleAlert,
                  label: "الإبلاغ",
                  type: "red",
                  onClick: () => {},
              },
          ];

    return (
        <div
            style={{
                opacity: comment.pending ? 0.6 : 1,
                pointerEvents: comment.pending ? "none" : "auto",
                borderBottom: "1px solid var(--color-border)",
                padding: "16px 0",
            }}
        >
            {/* Header row: Avatar + Name/meta + MoreMenu */}
            <div
                className="flex items-center justify-between"
                style={{ marginBottom: 10 }}
            >
                <div className="flex items-center gap-2.5">
                    <Avatar
                        img={comment.author?.image}
                        initials={comment.author?.name?.[0]}
                        size={avatarSize}
                    />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Link
                                href={`/@${comment.author?.username}`}
                                style={{
                                    fontWeight: 600,
                                    fontSize: 15,
                                    color: "var(--color-ink)",
                                    textDecoration: "none",
                                }}
                                className="hover:text-accent"
                            >
                                {comment.author?.name}
                            </Link>
                            {comment.isByAuthor && (
                                <span
                                    style={{
                                        color: "var(--color-gold)",
                                        borderRadius: "var(--radius-pill)",
                                        padding: "1px 8px",
                                        fontSize: 11,
                                        fontWeight: 600,
                                    }}
                                >
                                    الكاتب
                                </span>
                            )}
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "var(--color-light-txt)",
                            }}
                        >
                            @{comment.author?.username} ·{" "}
                            {formatRelativeTime(comment.createdAt)}
                            {comment.isEdited && !comment.isDeleted && (
                                <span style={{ color: "var(--color-mid)" }}>
                                    {" "}
                                    · (مُعدَّل)
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {!comment.isDeleted && (
                    <MoreMenu options={menuOptions} widthClass="w-[180px]">
                        <Ellipsis size={19}></Ellipsis>
                    </MoreMenu>
                )}
            </div>

            {/* Content */}
            <div style={{ marginBottom: 10 }}>
                {comment.isDeleted ? (
                    <p
                        style={{
                            margin: 0,
                            fontStyle: "italic",
                            color: "var(--color-mid)",
                            fontSize: 15,
                            lineHeight: 1.7,
                        }}
                    >
                        تم حذف هذا التعليق
                    </p>
                ) : editing ? (
                    <div>
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            autoFocus
                            rows={3}
                            style={{
                                width: "100%",
                                padding: "8px 10px",
                                fontSize: 15,
                                lineHeight: 1.6,
                                borderRadius: "var(--border-radius)",
                                border: "1px solid var(--color-border)",
                                background: "var(--color-bg)",
                                color: "var(--color-ink)",
                                resize: "vertical",
                                fontFamily: "var(--font-family-serif)",
                            }}
                        />
                        <div className="flex items-center gap-2 mt-2" dir="ltr">
                            <Button
                                variant="primary"
                                onClick={handleSave}
                                disabled={!editedContent.trim()}
                                style={{ padding: "5px 14px", fontSize: 13 }}
                            >
                                حفظ
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleCancelEdit}
                                style={{ padding: "5px 14px", fontSize: 13 }}
                            >
                                إلغاء
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p
                        style={{
                            margin: 0,
                            fontSize: 15,
                            lineHeight: 1.7,
                            color: "var(--color-ink)",
                        }}
                    >
                        {renderContent(comment.content)}
                    </p>
                )}
            </div>

            {/* Actions bar: like + replies-toggle grouped, reply pushed to the far edge */}
            {!comment.isDeleted && !editing && (
                <div className="flex items-center gap-4">
                    <RequireAuth>
                        <button
                            onClick={() =>
                                onLike({
                                    commentId: comment.id,
                                    liked: comment.likedByMe,
                                })
                            }
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                fontSize: 13,
                                color: comment.likedByMe
                                    ? "var(--color-accent)"
                                    : "var(--color-light-txt)",
                            }}
                        >
                            <ThumbsUp
                                size={16}
                                className={`cursor-pointer ${
                                    comment.likedByMe
                                        ? "text-accent"
                                        : "text-mid hover:text-ink"
                                }`}
                                fill={
                                    comment.likedByMe
                                        ? "var(--color-accent)"
                                        : "none"
                                }
                            />
                            {comment.likeCount > 0 && (
                                <span>{comment.likeCount}</span>
                            )}
                        </button>
                    </RequireAuth>

                    {comment.replyCount > 0 && (
                        <button
                            onClick={onToggleReplies}
                            disabled={!onToggleReplies}
                            className="text-mid hover:text-ink"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: onToggleReplies ? "pointer" : "default",
                                fontSize: 13,
                            }}
                        >
                            <MessageSquare size={16} />
                            <span>
                                {repliesExpanded
                                    ? "إخفاء الردود"
                                    : `${comment.replyCount} رد`}
                            </span>
                        </button>
                    )}

                    {comment.depth < 3 && (
                        <button
                            onClick={() => setReplyOpen(!replyOpen)}
                            className="text-mid hover:text-ink"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
                            رد
                        </button>
                    )}
                </div>
            )}

            {/* Inline reply composer */}
            {replyOpen && (
                <div style={{ marginTop: 8 }}>
                    <CommentComposer
                        articleId={articleId}
                        articleAuthorId={articleAuthorId}
                        parentId={comment.id}
                        parentAuthor={comment.author}
                        autoFocus
                        onSubmitted={() => {
                            setReplyOpen(false);
                            onReplyPosted?.();
                        }}
                        onCancel={() => setReplyOpen(false)}
                    />
                </div>
            )}

            {/* Delete confirmation */}
            <ConfirmModal
                isOpen={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
                icon={Trash2}
                color="var(--color-error)"
                icoBackground="var(--color-error-light)"
                title="حذف التعليق؟"
                description="سيتم حذف هذا التعليق نهائياً"
                buttonText="حذف"
                loading={confirmLoading}
            />
        </div>
    );
}
