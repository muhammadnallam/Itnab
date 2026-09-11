"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getTopAuthors } from "@/lib/api/top-authors";

export function useTopAuthors(limit = 10, { enabled = true } = {}) {
    const { data, isPending } = useQuery({
        queryKey: queryKeys.topAuthors(limit),
        queryFn: () => getTopAuthors(limit),
        staleTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled,
    });

    return {
        authors: data ?? [],
        loading: isPending && !data,
    };
}
