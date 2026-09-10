"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getFollowers } from "@/lib/api/user";

export function useFollowers(userId, { enabled = true } = {}) {
    const { data, isPending } = useQuery({
        queryKey: queryKeys.followers(userId),
        queryFn: () => getFollowers(userId, { limit: 50 }),
        enabled: !!userId && enabled,
        refetchOnWindowFocus: false,
    });

    return {
        writers: data?.items ?? [],
        loading: isPending && !data,
    };
}
