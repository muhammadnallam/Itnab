"use client";

import { useContext } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { UserContext } from "@/context/UserContext";
import { queryKeys } from "@/lib/query-keys";
import { getNotifications, getUnreadCount } from "@/lib/api/notifications";

const PAGE_LIMIT = 20;

export function useNotifications({ limit = PAGE_LIMIT } = {}) {
    const { user } = useContext(UserContext);

    const query = useInfiniteQuery({
        queryKey: queryKeys.notificationsList({ limit }),
        queryFn: ({ pageParam = 1 }) =>
            getNotifications({ page: pageParam, limit }),
        initialPageParam: 1,
        getNextPageParam: (last) =>
            last?.hasMore ? last?.nextPage : undefined,
        enabled: !!user,
        staleTime: 15000,
    });

    const pages = query.data?.pages ?? [];
    const notifications = pages.flatMap((p) => p?.notifications ?? []);
    const total = pages.length
        ? (pages[pages.length - 1]?.total ?? notifications.length)
        : 0;

    return {
        ...query,
        pages,
        notifications,
        total,
    };
}

export function useUnreadCount() {
    const { user } = useContext(UserContext);

    const query = useQuery({
        queryKey: queryKeys.notificationsUnread(),
        queryFn: getUnreadCount,
        enabled: !!user,
        refetchInterval: 30000,
        staleTime: 15000,
    });

    return {
        ...query,
        unreadCount: query.data?.count ?? 0,
    };
}
