"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { reportError } from "@/lib/notify";
import {
    getLikesState,
    setReaction,
    deleteReaction,
} from "@/lib/api/interactions";

const EMPTY = { type: null, likeCount: 0, dislikeCount: 0 };

export function useLikes(articleId) {
    const qc = useQueryClient();
    const key = queryKeys.likes(articleId);

    const { data, isLoading } = useQuery({
        queryKey: key,
        queryFn: () => getLikesState(articleId),
        enabled: !!articleId,
    });

    const mutation = useMutation({
        mutationFn: (type) =>
            type ? setReaction(articleId, type) : deleteReaction(articleId),
        onMutate: async (type) => {
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData(key);
            const old = { ...EMPTY, ...(prev ?? {}) };
            let likeCount = old.likeCount;
            let dislikeCount = old.dislikeCount;
            if (old.type === "LIKE") likeCount -= 1;
            if (old.type === "DISLIKE") dislikeCount -= 1;
            if (type === "LIKE") likeCount += 1;
            if (type === "DISLIKE") dislikeCount += 1;
            qc.setQueryData(key, { ...old, type, likeCount, dislikeCount });
            return { prev };
        },
        onError: (err, type, context) => {
            qc.setQueryData(key, context.prev);
            reportError(err);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: key });
        },
    });

    return {
        type: data?.type ?? null,
        likeCount: data?.likeCount ?? 0,
        dislikeCount: data?.dislikeCount ?? 0,
        isLoading,
        like: () => mutation.mutate("LIKE"),
        dislike: () => mutation.mutate("DISLIKE"),
        clear: () => mutation.mutate(null),
        isMutating: mutation.isPending,
    };
}