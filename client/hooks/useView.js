"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { recordView } from "@/lib/api/interactions";

export function useView(articleId) {
    const { mutate } = useMutation({
        mutationFn: () => recordView(articleId),
    });
    const fired = useRef(false);

    useEffect(() => {
        if (!articleId || fired.current) return;
        fired.current = true;
        mutate();
    }, [articleId, mutate]);

    return { mutate };
}