"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getComments } from "@/lib/api/comments";

export function useComments(articleId) {
    const {
        data,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = useInfiniteQuery({
        queryKey: queryKeys.comments(articleId),
        queryFn: ({ pageParam = 1 }) =>
            getComments(articleId, { page: pageParam }),
        getNextPageParam: (last) => last.nextPage ?? undefined,
        enabled: !!articleId,
    });

    const pages = data?.pages ?? [];
    const comments = pages.flatMap((p) => p.comments ?? []);
    const total = pages.length ? pages[pages.length - 1].total : 0;

    return {
        pages,
        comments,
        total,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    };
}
