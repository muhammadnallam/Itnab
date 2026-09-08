"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { search } from "@/lib/api/search";

export function useSearch(q, { enabled = true } = {}) {
    const trimmed = q?.trim() ?? "";
    const { data, isPending, isFetching } = useQuery({
        queryKey: queryKeys.search(trimmed),
        queryFn: ({ signal }) => search({ q: trimmed, signal }),
        enabled: enabled && trimmed.length >= 2,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    });
    return {
        articles: data?.articles ?? [],
        authors: data?.authors ?? [],
        loading: isPending && trimmed.length >= 2,
        isFetching,
    };
}
