"use client";

import { useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useComments } from "@/hooks/useComments";
import {
    useUpdateComment,
    useDeleteComment,
    useCommentLike,
} from "@/hooks/useCommentActions";
import CommentComposer from "./CommentComposer";
import CommentThread from "./CommentThread";
import Button from "@/components/ui/Button";
import { MessageSquare } from "lucide-react";

function CommentSkeleton() {
    return (
        <div>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    style={{
                        padding: "16px 0",
                        borderBottom: "1px solid var(--color-border)",
                    }}
                >
                    <div className="flex items-center gap-2.5">
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background: "var(--color-tag-bg)",
                                animation: "pulse 1.5s ease-in-out infinite",
                            }}
                        />
                        <div className="flex flex-col gap-1.5">
                            <div
                                style={{
                                    width: 100,
                                    height: 12,
                                    borderRadius: 4,
                                    background: "var(--color-tag-bg)",
                                    animation:
                                        "pulse 1.5s ease-in-out infinite",
                                }}
                            />
                            <div
                                style={{
                                    width: 70,
                                    height: 10,
                                    borderRadius: 4,
                                    background: "var(--color-tag-bg)",
                                    animation:
                                        "pulse 1.5s ease-in-out infinite",
                                }}
                            />
                        </div>
                    </div>
                    <div
                        className="flex flex-col gap-2"
                        style={{ marginTop: 10, paddingRight: 42 }}
                    >
                        <div
                            style={{
                                width: "90%",
                                height: 12,
                                borderRadius: 4,
                                background: "var(--color-tag-bg)",
                                animation: "pulse 1.5s ease-in-out infinite",
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
                </div>
            ))}
        </div>
    );
}

export default function CommentsSection({ articleId, authorId, sectionRef }) {
    const { user } = useContext(UserContext);
    const {
        comments,
        total: totalCount,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
    } = useComments(articleId);

    const updateComment = useUpdateComment(articleId);
    const deleteCommentMutation = useDeleteComment(articleId);
    const likeCommentMutation = useCommentLike(articleId);

    return (
        <section
            id="comments"
            ref={sectionRef}
            style={{ maxWidth: 740, margin: "auto", paddingBottom: 80 }}
        >
            {/* Header */}
            <div
                className="flex items-center gap-2"
                style={{
                    borderBottom: "1px solid var(--color-border)",
                    paddingBottom: 12,
                    marginBottom: 8,
                }}
            >
                <MessageSquare
                    size={20}
                    style={{ color: "var(--color-mid)" }}
                />
                <span
                    style={{
                        fontWeight: 700,
                        fontSize: 20,
                        color: "var(--color-ink)",
                    }}
                >
                    التعليقات
                </span>
                <span
                    style={{
                        color: "var(--color-mid)",
                        fontSize: 16,
                    }}
                >
                    {totalCount}
                </span>
            </div>

            {/* Top-level composer */}
            <CommentComposer articleId={articleId} articleAuthorId={authorId} />

            {/* Divider between composer and the comment list */}
            <div
                style={{
                    borderTop: "1px solid var(--color-border)",
                    marginTop: 8,
                }}
            />

            {/* Loading state */}
            {isLoading && <CommentSkeleton />}

            {/* Empty state */}
            {!isLoading && comments.length === 0 && (
                <div
                    style={{
                        textAlign: "center",
                        color: "var(--color-mid)",
                        padding: 40,
                        fontSize: 15,
                    }}
                >
                    لا توجد تعليقات بعد. كن أول من يعلّق!
                </div>
            )}

            {/* Comment list */}
            {!isLoading && comments.length > 0 && (
                <CommentThread
                    comments={comments}
                    articleId={articleId}
                    articleAuthorId={authorId}
                    currentUserId={user?.id}
                    onDelete={(commentId) =>
                        deleteCommentMutation.mutate(commentId)
                    }
                    onEdit={({ commentId, content }) =>
                        updateComment.mutate({ commentId, content })
                    }
                    onLike={({ commentId, liked }) =>
                        likeCommentMutation.mutate({ commentId, liked })
                    }
                />
            )}

            {/* Load more button */}
            {hasNextPage && (
                <div style={{ marginTop: 24 }}>
                    <Button
                        variant="secondary"
                        onClick={() => fetchNextPage()}
                        loading={isFetchingNextPage}
                        style={{
                            width: "100%",
                            borderRadius: 12,
                            padding: "10px",
                            fontSize: 14,
                        }}
                    >
                        عرض المزيد من التعليقات
                    </Button>
                </div>
            )}
        </section>
    );
}
