"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { queryKeys } from "@/lib/query-keys";

export function useFollow(userId) {
    const qc = useQueryClient();
    const key = queryKeys.follow(userId);

    const { data, isLoading, error } = useQuery({
        queryKey: key,
        queryFn: () => fetcher(`/api/users/${userId}/follow`),
        enabled: !!userId,
    });

    const mutation = useMutation({
        mutationFn: (follow) =>
            fetcher(`/api/users/${userId}/follow`, {
                method: follow ? "PUT" : "DELETE",
            }),
        onMutate: async (follow) => {
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData(key);
            qc.setQueryData(key, (old) => ({
                ...old,
                isFollowing: follow,
                followerCount:
                    (old?.followerCount ?? 0) + (follow ? 1 : -1),
            }));
            return { prev };
        },
        onError: (err, follow, context) => {
            qc.setQueryData(key, context.prev);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: key });
        },
    });

    return {
        isFollowing: data?.isFollowing ?? false,
        followerCount: data?.followerCount ?? 0,
        isLoading,
        error,
        toggle: () => mutation.mutate(!data?.isFollowing),
        isMutating: mutation.isPending,
    };
}