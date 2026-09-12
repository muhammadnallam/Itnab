"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "sonner";
import {
    getSaveState,
    saveArticle,
    unsaveArticle,
} from "@/lib/api/interactions";

export function useSave(articleId) {
    const qc = useQueryClient();
    const key = queryKeys.save(articleId);

    const { data, isLoading } = useQuery({
        queryKey: key,
        queryFn: () => getSaveState(articleId),
        enabled: !!articleId,
    });

    const mutation = useMutation({
        mutationFn: (save) =>
            save ? saveArticle(articleId) : unsaveArticle(articleId),
        onMutate: async (save) => {
            await qc.cancelQueries({ queryKey: key });
            const prev = qc.getQueryData(key);
            qc.setQueryData(key, (old) => ({
                ...old,
                saved: save,
                savedCount: (old?.savedCount ?? 0) + (save ? 1 : -1),
            }));
            return { prev };
        },
        onSuccess: (_data, save) => {
            if (save) {
                toast.success("تم حفظ المقال");
            } else {
                toast.success("تم إزالة الحفظ", {
                    duration: 5000,
                    action: {
                        label: "تراجع",
                        onClick: () => mutation.mutate(true),
                    },
                });
            }
        },
        onError: (err, save, context) => {
            qc.setQueryData(key, context.prev);
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: key });
        },
    });

    return {
        saved: data?.saved ?? false,
        savedCount: data?.savedCount ?? 0,
        isLoading,
        toggle: () => mutation.mutate(!data?.saved),
        isMutating: mutation.isPending,
    };
}