"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
    getArticle,
    publishArticle,
    updateArticle,
    deleteArticle,
} from "@/lib/api/article";

export function useArticle(slug) {
    const qc = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.article(slug),
        queryFn: () => getArticle(slug),
        enabled: !!slug,
        staleTime: 30 * 1000,
    });

    const publish = useMutation({
        mutationFn: publishArticle,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.allArticles() });
        },
    });

    const update = useMutation({
        mutationFn: updateArticle,
        onSuccess: () => {
            if (slug) {
                qc.invalidateQueries({ queryKey: queryKeys.article(slug) });
            }
            qc.invalidateQueries({ queryKey: queryKeys.allArticles() });
        },
    });

    const remove = useMutation({
        mutationFn: deleteArticle,
        onSuccess: () => {
            if (slug) {
                qc.removeQueries({ queryKey: queryKeys.article(slug) });
            }
            qc.invalidateQueries({ queryKey: queryKeys.allArticles() });
        },
    });

    return { article: data, isLoading, error, publish, update, remove };
}