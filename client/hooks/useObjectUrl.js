"use client";

import { useEffect, useState } from "react";

export function useObjectUrl(value) {
    const isFile = Boolean(value) && typeof value !== "string";
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (!isFile) return;
        const objectUrl = URL.createObjectURL(value);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [isFile, value]);

    return isFile ? url : value ?? null;
}
