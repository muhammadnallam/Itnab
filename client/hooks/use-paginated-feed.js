import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal offset-pagination feed hook shared by the home and profile pages.
 * `fetcher(page)` must resolve to `{ items, hasMore, nextPage }`.
 * When `enabled` turns true it loads page 1; afterwards `loadMore` appends
 * the next page. `loaded` flips once the first page has resolved.
 */
export default function usePaginatedFeed(fetcher, { enabled = true } = {}) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const nextPageRef = useRef(null);
    const fetcherRef = useRef(fetcher);

    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    const loadFirst = useCallback(async () => {
        try {
            const res = await fetcherRef.current(1);
            setItems(res.items);
            setHasMore(res.hasMore);
            nextPageRef.current = res.nextPage;
            setLoaded(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (enabled) loadFirst();
    }, [enabled, loadFirst]);

    const loadMore = useCallback(async () => {
        if (loadingMore || !nextPageRef.current) return;
        setLoadingMore(true);
        try {
            const res = await fetcherRef.current(nextPageRef.current);
            setItems((prev) => [...prev, ...res.items]);
            setHasMore(res.hasMore);
            nextPageRef.current = res.nextPage;
        } finally {
            setLoadingMore(false);
        }
    }, [loadingMore]);

    return {
        items,
        loading,
        loadingMore,
        hasMore,
        loaded,
        loadMore,
        loadFirst,
    };
}
