"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { queryKeys } from "@/lib/query-keys";

export function useLikes(articleId) {
    const qc = useQueryClient();
    const key = queryKeys.likes(articleId);

    const { data, isLoading, error } = useQuery({
        queryKey: key,
        queryFn: () => fetcher(`/api/articles/${articleId}/likes`),
        enabled: !!articleId,
    });

    const mutation = useMutation({
        mutationFn: (liked) =>
            fetcher(`/api/articles/${articleId}/likes`, {
                method: liked ? "PUT" : "DELETE",
            }),
        onMutate: async (liked) => {
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData(key);
            qc.setQueryData(key, (old) => ({
                ...old,
                liked,
                likeCount: (old?.likeCount ?? 0) + (liked ? 1 : -1),
            }));
            return { prev };
        },
        onError: (err, liked, context) => {
            qc.setQueryData(key, context.prev);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: key });
        },
    });

    return {
        liked: data?.liked ?? false,
        likeCount: data?.likeCount ?? 0,
        isLoading,
        error,
        toggle: () => mutation.mutate(!data?.liked),
        isMutating: mutation.isPending,
    };
}