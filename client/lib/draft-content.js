import { MAX_FILE_SIZE } from "@/lib/tiptap-utils";

function clone(content) {
    return JSON.parse(JSON.stringify(content));
}

function isPendingPlaceholder(node) {
    return node?.type === "imageUpload" && node.attrs?.pending === true;
}

export function countPlaceholderImages(content) {
    if (!content) return 0;

    let count = 0;

    function walk(node) {
        if (isPendingPlaceholder(node)) {
            count += 1;
        }
        if (Array.isArray(node?.content)) {
            for (const child of node.content) {
                walk(child);
            }
        }
    }

    walk(content);
    return count;
}

export function stripPlaceholderImages(content) {
    const cloned = clone(content);
    let removed = 0;

    function strip(node) {
        if (!Array.isArray(node?.content)) return;

        const next = [];
        for (const child of node.content) {
            if (isPendingPlaceholder(child)) {
                removed += 1;
                continue;
            }
            strip(child);
            next.push(child);
        }
        node.content = next;
    }

    strip(cloned);
    return { content: cloned, removed };
}

export function serializeDraftContent(content) {
    const cloned = clone(content);

    function transform(node) {
        if (
            node?.type === "image" &&
            typeof node.attrs?.src === "string" &&
            node.attrs.src.startsWith("blob:")
        ) {
            return {
                type: "imageUpload",
                attrs: {
                    accept: "image/*",
                    limit: 1,
                    maxSize: MAX_FILE_SIZE,
                    pending: true,
                    originalName: node.attrs.alt || node.attrs.title || null,
                },
            };
        }

        if (Array.isArray(node?.content)) {
            node.content = node.content.map(transform);
        }

        return node;
    }

    return transform(cloned);
}
