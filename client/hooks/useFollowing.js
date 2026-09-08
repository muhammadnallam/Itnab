"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getFollowing } from "@/lib/api/user";

export function useFollowing(userId, { enabled = true } = {}) {
    const { data, isPending } = useQuery({
        queryKey: queryKeys.following(userId),
        queryFn: () => getFollowing(userId, { limit: 50 }),
        enabled: !!userId && enabled,
        refetchOnWindowFocus: false,
    });

    return {
        writers: data?.items ?? [],
        loading: isPending && !data,
    };
}
