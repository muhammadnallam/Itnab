"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useAuthModal } from "@/context/AuthModalContext";
import { useCreateComment } from "@/hooks/useCommentActions";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function CommentComposer({
    articleId,
    articleAuthorId,
    parentId,
    parentAuthor,
    onSubmitted,
    onCancel,
    autoFocus = false,
}) {
    const { user } = useContext(UserContext);
    const { openAuth } = useAuthModal();
    const textareaRef = useRef(null);
    const [content, setContent] = useState("");
    const [focused, setFocused] = useState(false);

    const isReply = !!parentId;
    const charLimit = 2000;
    const isActive = content.length > 0;
    const isOpen = focused || isActive;

    const { mutate, isPending } = useCreateComment(articleId, articleAuthorId);

    useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [autoFocus]);

    useEffect(() => {
        if (isReply && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isReply]);

    const isDisabled = !content.trim() || content.length > charLimit || isPending;

    function handleSubmit() {
        if (isDisabled) return;

        mutate(
            { content: content.trim(), parentId },
            {
                onSuccess: () => {
                    setContent("");
                    setFocused(false);
                    onSubmitted?.();
                },
                onError: (err) => {
                    toast.error(err?.message || "حدث خطأ أثناء إرسال التعليق");
                },
            },
        );
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
        }
    }

    if (!user) {
        return (
            <div style={{ padding: "16px 0" }}>
                <button
                    onClick={() => openAuth("login")}
                    style={{
                        width: "100%",
                        textAlign: "right",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        background: "none",
                        padding: "12px 16px",
                        fontSize: 15,
                        color: "var(--color-mid)",
                        fontFamily: "var(--font-family-serif)",
                        cursor: "pointer",
                    }}
                >
                    شارك بتعليقك...
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: "16px 0" }}>
            {isReply && (
                <div
                    className="flex items-center gap-2"
                    style={{
                        marginBottom: 8,
                        background: "var(--color-tag-bg)",
                        borderRadius: "var(--radius-pill)",
                        padding: "4px 12px",
                        fontSize: 13,
                        width: "fit-content",
                    }}
                >
                    <span style={{ color: "var(--color-mid)" }}>
                        رد على @{parentAuthor?.username}
                    </span>
                    <button
                        onClick={onCancel}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--color-mid)",
                            cursor: "pointer",
                            background: "none",
                            border: "none",
                            padding: 0,
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* User identity row (shown above the box, like Medium's response composer) */}
            {!isReply && (
                <div
                    className="flex items-center gap-2.5"
                    style={{ marginBottom: 10 }}
                >
                    <Avatar img={user.image} initials={user.name?.[0]} size={36} />
                    <span
                        style={{
                            fontWeight: 600,
                            fontSize: 15,
                            color: "var(--color-ink)",
                        }}
                    >
                        {user.name}
                    </span>
                </div>
            )}

            {/* Boxed input */}
            <div
                style={{
                    border: `1px solid ${isOpen ? "var(--color-accent)" : "var(--color-border)"}`,
                    borderRadius: 12,
                    padding: "12px 14px",
                    transition: "border-color 0.2s",
                }}
            >
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    placeholder={
                        isReply
                            ? `رد على ${parentAuthor?.name}...`
                            : "شارك بتعليقك..."
                    }
                    dir="rtl"
                    disabled={isPending}
                    rows={isOpen ? 3 : 1}
                    style={{
                        width: "100%",
                        border: "none",
                        padding: 0,
                        fontSize: 15,
                        fontFamily: "var(--font-family-serif)",
                        color: "var(--color-ink)",
                        background: "transparent",
                        resize: "none",
                        outline: "none",
                        lineHeight: 1.6,
                        overflow: "hidden",
                    }}
                />

                {isOpen && (
                    <div
                        className="flex items-center justify-between"
                        style={{ marginTop: 8 }}
                    >
                        <span
                            style={{
                                fontSize: 12,
                                color:
                                    content.length > charLimit
                                        ? "var(--color-error)"
                                        : "var(--color-mid)",
                            }}
                        >
                            {content.length}/{charLimit}
                        </span>

                        <div className="flex gap-2">
                            {isActive && (
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setContent("");
                                        setFocused(false);
                                    }}
                                    style={{
                                        padding: "5px 14px",
                                        fontSize: 13,
                                    }}
                                >
                                    إلغاء
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                onClick={handleSubmit}
                                disabled={isDisabled}
                                loading={isPending}
                                style={{
                                    padding: "5px 14px",
                                    fontSize: 13,
                                    borderRadius: "var(--radius-pill)",
                                }}
                            >
                                نشر
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}