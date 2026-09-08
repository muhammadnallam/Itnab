"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getExploreRecommendations } from "@/lib/api/explore";

export function useExploreRecommendations({ enabled = true } = {}) {
    const { data, isPending, refetch } = useQuery({
        queryKey: queryKeys.exploreRecommendations(),
        queryFn: getExploreRecommendations,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled,
    });
    return {
        bestThisMonth: data?.bestThisMonth ?? [],
        randomArticles: data?.randomArticles ?? [],
        randomAuthors: data?.randomAuthors ?? [],
        loading: isPending,
        refetch,
    };
}
