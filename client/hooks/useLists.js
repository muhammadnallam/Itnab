"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getUserLists, createList } from "@/lib/api/feed";
import { saveArticle, unsaveArticle } from "@/lib/api/interactions";

export function useLists({ author, articleId, enabled = true } = {}) {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isPending,
        refetch,
    } = useInfiniteQuery({
        queryKey: queryKeys.lists(author, articleId),
        queryFn: ({ pageParam = 1 }) =>
            getUserLists(author, { articleId, page: pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
        enabled: !!author && enabled,
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

export function useCreateList() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (name) => createList(name),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["lists"] });
        },
    });
}

export function useSaveToList(articleId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (listId) => saveArticle(articleId, { listId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["lists"] });
            qc.invalidateQueries({ queryKey: ["userSaves"] });
            qc.invalidateQueries({ queryKey: queryKeys.allArticles() });
            qc.invalidateQueries({ queryKey: queryKeys.save(articleId) });
        },
    });
}

export function useUnsaveFromList(articleId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (listId) => unsaveArticle(articleId, { listId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["lists"] });
            qc.invalidateQueries({ queryKey: ["userSaves"] });
            qc.invalidateQueries({ queryKey: queryKeys.allArticles() });
            qc.invalidateQueries({ queryKey: queryKeys.save(articleId) });
        },
    });
}
