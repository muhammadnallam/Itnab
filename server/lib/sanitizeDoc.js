import { isIP } from "node:net";

const MAX_NESTING = 20;
const MAX_NODES = 2000;

const PRIVATE_HOST_SUFFIXES = [
    ".localhost",
    ".local",
    ".internal",
    ".home.arpa",
];

const PRIVATE_IPV4_RANGES = [
    [127, 0, 0, 0, 8],
    [10, 0, 0, 0, 8],
    [172, 16, 0, 0, 12],
    [192, 168, 0, 0, 16],
    [169, 254, 0, 0, 16],
    [0, 0, 0, 0, 8],
    [100, 64, 0, 0, 10],
];

function parseUrl(raw) {
    if (typeof raw !== "string") {
        return null;
    }

    const trimmed = raw.trim();
    if (!trimmed) {
        return null;
    }

    try {
        return new URL(trimmed);
    } catch {
        return null;
    }
}

function ipv4ToInt(ip) {
    return ip
        .split(".")
        .reduce((acc, part) => (acc * 256 + Number(part)) >>> 0, 0);
}

function isPrivateIPv4(ip) {
    const value = ipv4ToInt(ip);

    return PRIVATE_IPV4_RANGES.some(([a, b, c, d, bits]) => {
        const base = ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
        const mask = (0xffffffff << (32 - bits)) >>> 0;
        return (value & mask) === (base & mask);
    });
}

function isPrivateIPv6(ip) {
    const address = ip.toLowerCase();

    if (address === "::1") {
        return true;
    }

    if (address.startsWith("fc") || address.startsWith("fd")) {
        return true;
    }

    const firstHextet = address.split(":")[0];
    if (firstHextet) {
        const value = parseInt(firstHextet, 16);
        if ((value & 0xffc0) === 0xfe80) {
            return true;
        }
    }

    const mappedPrefix = "::ffff:";
    if (address.startsWith(mappedPrefix)) {
        const mapped = address.slice(mappedPrefix.length);
        if (mapped.includes(".")) {
            return isPrivateIPv4(mapped);
        }

        const hextets = mapped.split(":");
        if (hextets.length === 2) {
            const high = parseInt(hextets[0], 16);
            const low = parseInt(hextets[1], 16);
            if (!Number.isNaN(high) && !Number.isNaN(low)) {
                const ipv4 = [
                    (high >> 8) & 0xff,
                    high & 0xff,
                    (low >> 8) & 0xff,
                    low & 0xff,
                ].join(".");
                return isPrivateIPv4(ipv4);
            }
        }
    }

    return false;
}

function isPrivateHost(hostname) {
    if (!hostname) {
        return true;
    }

    const host = hostname.toLowerCase();

    if (host === "localhost" || host.endsWith(".localhost")) {
        return true;
    }

    if (PRIVATE_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
        return true;
    }

    const bare =
        host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;

    const version = isIP(bare);

    if (version === 4) {
        return isPrivateIPv4(bare);
    }

    if (version === 6) {
        return isPrivateIPv6(bare);
    }

    return false;
}

function isSafeUrl(raw, { allowMailto = false, allowHttp = false } = {}) {
    const url = parseUrl(raw);
    if (!url) {
        return false;
    }

    const protocol = url.protocol.toLowerCase();

    if (protocol === "mailto:") {
        return allowMailto;
    }

    if (protocol === "https:") {
        return !isPrivateHost(url.hostname);
    }

    if (protocol === "http:") {
        if (!allowHttp) {
            return false;
        }
        return !isPrivateHost(url.hostname);
    }

    return false;
}

function isUnsafeImage(node) {
    return node?.type === "image" && typeof node.attrs?.src !== "string";
}

function sanitizeDoc(json, options = {}) {
    const maxNesting = options.maxNesting ?? MAX_NESTING;
    const maxNodes = options.maxNodes ?? MAX_NODES;

    let nodeCount = 0;

    function walk(node, depth) {
        if (depth > maxNesting) {
            throw new Error(
                `Document exceeds maximum nesting depth of ${maxNesting}`,
            );
        }

        nodeCount++;
        if (nodeCount > maxNodes) {
            throw new Error(
                `Document exceeds maximum node count of ${maxNodes}`,
            );
        }

        if (Array.isArray(node.marks)) {
            node.marks = node.marks.filter((mark) => {
                if (mark?.type === "link") {
                    return isSafeUrl(mark.attrs?.href, {
                        allowMailto: true,
                        allowHttp: true,
                    });
                }
                return true;
            });
        }

        if (node.attrs && typeof node.attrs === "object") {
            if (
                typeof node.attrs.src === "string" &&
                !isSafeUrl(node.attrs.src, {
                    allowMailto: false,
                    allowHttp: false,
                })
            ) {
                delete node.attrs.src;
            }

            if (
                typeof node.attrs.href === "string" &&
                !isSafeUrl(node.attrs.href, {
                    allowMailto: true,
                    allowHttp: true,
                })
            ) {
                delete node.attrs.href;
            }

            if ("alt" in node.attrs && typeof node.attrs.alt !== "string") {
                delete node.attrs.alt;
            }

            if ("title" in node.attrs && typeof node.attrs.title !== "string") {
                delete node.attrs.title;
            }
        }

        if (Array.isArray(node.content)) {
            node.content = node.content
                .map((child) => walk(child, depth + 1))
                .filter((child) => !isUnsafeImage(child));
        }

        return node;
    }

    return walk(JSON.parse(JSON.stringify(json)), 0);
}

export { sanitizeDoc };
