"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { queryKeys } from "@/lib/query-keys";

export function useComments(articleId) {
    const qc = useQueryClient();
    const key = queryKeys.comments(articleId);

    const { data, isLoading, error } = useQuery({
        queryKey: key,
        queryFn: () => fetcher(`/api/articles/${articleId}/comments`),
        enabled: !!articleId,
    });

    const addComment = useMutation({
        mutationFn: (content) =>
            fetcher(`/api/articles/${articleId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content }),
            }),
        onSettled: () => {
            qc.invalidateQueries({ queryKey: key });
        },
    });

    return {
        comments: data ?? [],
        isLoading,
        error,
        addComment: addComment.mutateAsync,
        isAdding: addComment.isPending,
    };
}