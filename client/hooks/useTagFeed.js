"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getTagArticles } from "@/lib/api/feed";

export function useTagFeed(topic, { enabled = true } = {}) {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
        useInfiniteQuery({
            queryKey: queryKeys.articleList({ topic, sort: "new" }),
            queryFn: ({ pageParam = 1 }) =>
                getTagArticles(topic, { page: pageParam, limit: 20 }),
            getNextPageParam: (lastPage) => lastPage.nextPage,
            initialPageParam: 1,
            enabled: enabled && Boolean(topic),
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
    };
}
