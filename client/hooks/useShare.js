"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { shareArticle } from "@/lib/api/interactions";

export function useShare(articleId) {
    const mutation = useMutation({
        mutationFn: (platform) => shareArticle(articleId, platform),
        onError: (err) => {
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        },
    });

    return {
        share: mutation.mutate,
        isSharing: mutation.isPending,
    };
}