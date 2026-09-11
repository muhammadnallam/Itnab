const TTL = 24 * 60 * 60 * 1000; // 24h

const cache = new Map();

export function getAuthorCache(key) {
    const hit = cache.get(key);
    if (!hit) return null;
    if (Date.now() - hit.fetchedAt > TTL) {
        cache.delete(key);
        return null;
    }
    return hit.data;
}

export function setAuthorCache(key, data) {
    cache.set(key, { data, fetchedAt: Date.now() });
}

export function clearAuthorCache() {
    cache.clear();
}
