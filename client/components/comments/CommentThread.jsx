"use client";

import { useState } from "react";
import CommentItem from "./CommentItem";

export default function CommentThread({
    comments,
    articleAuthorId,
    articleId,
    currentUserId,
    depth = 1,
    onDelete,
    onEdit,
    onLike,
    onReply,
}) {
    // Replies are collapsed by default at every level, matching Medium's
    // "N replies" toggle. Each level tracks its own expanded comment ids.
    const [expandedIds, setExpandedIds] = useState(() => new Set());

    const toggleExpanded = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const expandComment = (id) => {
        setExpandedIds((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    };

    return (
        <div className="flex flex-col">
            {comments.map((comment) => {
                const hasReplies = comment.replies?.length > 0;
                const isExpanded = expandedIds.has(comment.id);

                return (
                    <div key={comment.id}>
                        <CommentItem
                            comment={comment}
                            articleAuthorId={articleAuthorId}
                            articleId={articleId}
                            currentUserId={currentUserId}
                            depth={depth}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onLike={onLike}
                            onReply={onReply}
                            repliesExpanded={isExpanded}
                            onToggleReplies={
                                hasReplies
                                    ? () => toggleExpanded(comment.id)
                                    : undefined
                            }
                            onReplyPosted={() => expandComment(comment.id)}
                        />
                        {hasReplies && isExpanded && (
                            <div className="ms-4 ps-4 border-s border-border">
                                <CommentThread
                                    comments={comment.replies}
                                    articleAuthorId={articleAuthorId}
                                    articleId={articleId}
                                    currentUserId={currentUserId}
                                    depth={depth + 1}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                    onLike={onLike}
                                    onReply={onReply}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
