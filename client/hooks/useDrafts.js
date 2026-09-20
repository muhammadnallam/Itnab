"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
    listDrafts,
    createDraft as createDraftRequest,
    saveDraft as saveDraftRequest,
    deleteDraft as deleteDraftRequest,
} from "@/lib/api/draft";

export function useDrafts({ articleId, enabled = true } = {}) {
    const qc = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.drafts(articleId),
        queryFn: () => listDrafts(articleId),
        enabled,
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
    });

    const createDraft = useMutation({
        mutationFn: createDraftRequest,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["drafts"] });
        },
    });

    const saveDraft = useMutation({
        mutationFn: saveDraftRequest,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: queryKeys.drafts(articleId) });
        },
    });

    const deleteDraft = useMutation({
        mutationFn: deleteDraftRequest,
        onSuccess: (_data, id) => {
            qc.removeQueries({ queryKey: queryKeys.draft(id) });
            qc.invalidateQueries({ queryKey: ["drafts"] });
        },
    });

    return {
        drafts: data?.drafts ?? [],
        isLoading,
        error,
        createDraft,
        saveDraft,
        deleteDraft,
    };
}
