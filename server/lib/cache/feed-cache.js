const TTL = 15 * 60 * 1000; // 15m

const cache = new Map();

export function getFeedCache(key) {
    const hit = cache.get(key);
    if (!hit) return null;
    if (Date.now() - hit.fetchedAt > TTL) {
        cache.delete(key);
        return null;
    }
    return hit.data;
}

export function setFeedCache(key, data) {
    cache.set(key, { data, fetchedAt: Date.now() });
}

export function clearFeedCache() {
    cache.clear();
}
