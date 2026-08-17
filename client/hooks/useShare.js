"use client";

import { useMutation } from "@tanstack/react-query";
import { reportError } from "@/lib/notify";
import { shareArticle } from "@/lib/api/interactions";

export function useShare(articleId) {
    const mutation = useMutation({
        mutationFn: (platform) => shareArticle(articleId, platform),
        onError: reportError,
    });

    return {
        share: mutation.mutate,
        isSharing: mutation.isPending,
    };
}