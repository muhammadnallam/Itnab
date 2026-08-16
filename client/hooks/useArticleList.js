"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getFeedArticles } from "@/lib/api/feed";

export function useArticleList(
    { sort = "top", author, limit = 20 },
    { enabled = true } = {},
) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        refetch,
    } = useInfiniteQuery({
        queryKey: queryKeys.articleList({ sort, author }),
        queryFn: ({ pageParam = 1 }) =>
            getFeedArticles({ sort, author, page: pageParam, limit }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
        enabled,
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