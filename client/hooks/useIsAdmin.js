"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getMe } from "@/lib/api/user";

export function useIsAdmin() {
    const { data, isLoading } = useQuery({
        queryKey: queryKeys.me(),
        queryFn: getMe,
        staleTime: Infinity,
        retry: false,
    });
    return { isAdmin: Boolean(data?.isAdmin), isLoading };
}
