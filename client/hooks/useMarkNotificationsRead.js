"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { markAllRead } from "@/lib/api/notifications";

export function useMarkNotificationsRead() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: markAllRead,
        onSuccess: () => {
            qc.setQueryData(queryKeys.notificationsUnread(), (old) => ({
                ...(old ?? {}),
                count: 0,
            }));
            qc.invalidateQueries({
                queryKey: ["notifications"],
            });
        },
    });
}
