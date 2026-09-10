"use client";

import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserContext } from "@/context/UserContext";
import { queryKeys } from "@/lib/query-keys";
import {
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    unlikeComment,
} from "@/lib/api/comments";

function walkPages(qc, key, updater) {
    qc.setQueryData(key, (data) => {
        if (!data) return data;
        return {
            ...data,
            pages: data.pages.map((page) => ({
                ...page,
                comments: updater(page.comments ?? []),
            })),
        };
    });
}

function mapCommentTree(comments, id, fn) {
    return comments.map((c) => {
        const withReplies = c.replies?.length
            ? { ...c, replies: mapCommentTree(c.replies, id, fn) }
            : c;
        return withReplies.id === id ? fn(withReplies) : withReplies;
    });
}

function findComment(comments, id) {
    for (const c of comments) {
        if (c.id === id) return c;
        if (c.replies?.length) {
            const found = findComment(c.replies, id);
            if (found) return found;
        }
    }
    return null;
}

export function useCreateComment(articleId, articleAuthorId) {
    const qc = useQueryClient();
    const key = queryKeys.comments(articleId);
    const { user } = useContext(UserContext);

    return useMutation({
        mutationFn: ({ content, parentId }) =>
            createComment(articleId, { content, parentId }),
        onMutate: async ({ content, parentId }) => {
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData(key);
            if (!user || !prev) return { prev };

            const allComments = prev.pages.flatMap((p) => p.comments ?? []);
            const parent = parentId
                ? findComment(allComments, parentId)
                : null;

            const optimistic = {
                id: "optimistic-" + crypto.randomUUID(),
                content,
                depth: parent ? parent.depth + 1 : 1,
                rootId: parent?.rootId ?? parent?.id ?? null,
                likeCount: 0,
                replyCount: 0,
                isEdited: false,
                isDeleted: false,
                likedByMe: false,
                isByAuthor: user.id === articleAuthorId,
                createdAt: new Date().toISOString(),
                author: {
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    image: user.image,
                },
                replies: [],
                pending: true,
            };

            if (parent) {
                walkPages(qc, key, (comments) => {
                    let updated = mapCommentTree(
                        comments,
                        parentId,
                        (c) => ({
                            ...c,
                            replies: [...(c.replies ?? []), optimistic],
                            replyCount: c.replyCount + 1,
                        }),
                    );
                    if (parent.depth > 1) {
                        updated = mapCommentTree(
                            updated,
                            parent.rootId ?? parent.id,
                            (c) => ({
                                ...c,
                                replyCount: c.replyCount + 1,
                            }),
                        );
                    }
                    return updated;
                });
            } else {
                qc.setQueryData(key, (data) => {
                    if (!data) return data;
                    return {
                        ...data,
                        pages: data.pages.map((page, i) =>
                            i === 0
                                ? {
                                      ...page,
                                      comments: [
                                          optimistic,
                                          ...(page.comments ?? []),
                                      ],
                                      total: (page.total ?? 0) + 1,
                                  }
                                : page,
                        ),
                    };
                });
            }
            return { prev };
        },
        onError: (err, vars, context) => {
            qc.setQueryData(key, context?.prev);
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: key });
        },
    });
}

export function useUpdateComment(articleId) {
    const qc = useQueryClient();
    const key = queryKeys.comments(articleId);

    return useMutation({
        mutationFn: ({ commentId, content }) =>
            updateComment(commentId, content),
        onMutate: async ({ commentId, content }) => {
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData(key);
            walkPages(qc, key, (comments) =>
                mapCommentTree(comments, commentId, (c) => ({
                    ...c,
                    content,
                    isEdited: true,
                })),
            );
            return { prev };
        },
        onError: (err, vars, context) => {
            qc.setQueryData(key, context?.prev);
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: key });
        },
    });
}

export function useDeleteComment(articleId) {
    const qc = useQueryClient();
    const key = queryKeys.comments(articleId);

    return useMutation({
        mutationFn: (commentId) => deleteComment(commentId),
        onMutate: async (commentId) => {
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData(key);
            walkPages(qc, key, (comments) =>
                mapCommentTree(comments, commentId, (c) => ({
                    ...c,
                    isDeleted: true,
                    content: null,
                })),
            );
            return { prev };
        },
        onError: (err, vars, context) => {
            qc.setQueryData(key, context?.prev);
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: key });
        },
    });
}

export function useCommentLike(articleId) {
    const qc = useQueryClient();
    const key = queryKeys.comments(articleId);

    return useMutation({
        mutationFn: ({ commentId, liked }) =>
            liked ? unlikeComment(commentId) : likeComment(commentId),
        onMutate: async ({ commentId, liked }) => {
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData(key);
            walkPages(qc, key, (comments) =>
                mapCommentTree(comments, commentId, (c) => ({
                    ...c,
                    likedByMe: !liked,
                    likeCount: c.likeCount + (liked ? -1 : 1),
                })),
            );
            return { prev };
        },
        onError: (err, vars, context) => {
            qc.setQueryData(key, context?.prev);
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: key });
        },
    });
}
