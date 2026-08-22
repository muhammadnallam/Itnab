"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getUserViews } from "@/lib/api/user";

export function useUserViews(userId, { enabled = true } = {}) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        refetch,
    } = useInfiniteQuery({
        queryKey: queryKeys.userViews(userId),
        queryFn: ({ pageParam = 1 }) => getUserViews(userId, { page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
        enabled: !!userId && enabled,
        refetchOnWindowFocus: false,
    });

    const items = data?.pages.flatMap((page) => page.items) ?? [];
    const loaded = !!data && data.pages.length > 0;

    return {
        items,
        loading: isPending && !loaded,
        loadingMore: isFetchingNextPage,
        hasMore: hasNextPage,
        loaded,
        loadMore: fetchNextPage,
        loadFirst: refetch,
    };
}
