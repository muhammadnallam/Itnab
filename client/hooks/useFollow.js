"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import {
    getFollowState,
    followUser,
    unfollowUser,
} from "@/lib/api/interactions";

export function useFollow(userId) {
    const qc = useQueryClient();
    const key = queryKeys.follow(userId);

    const { data, isLoading } = useQuery({
        queryKey: key,
        queryFn: () => getFollowState(userId),
        enabled: !!userId,
    });

    const mutation = useMutation({
        mutationFn: (follow) =>
            follow ? followUser(userId) : unfollowUser(userId),
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
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: key });
        },
    });

    return {
        isFollowing: data?.isFollowing ?? false,
        followerCount: data?.followerCount ?? 0,
        isLoading,
        toggle: () => mutation.mutate(!data?.isFollowing),
        isMutating: mutation.isPending,
    };
}