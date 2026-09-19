"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getTopTags } from "@/lib/api/tags";

export function useTopTags(limit = 8, { enabled = true } = {}) {
    const { data, isPending } = useQuery({
        queryKey: queryKeys.topTags(limit),
        queryFn: () => getTopTags(limit),
        staleTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled,
    });

    return {
        tags: data ?? [],
        loading: isPending && !data,
    };
}
