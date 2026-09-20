const CONTENT_NODE_TYPES = new Set(["image", "quranVerse"]);

export function hasContent(doc) {
    let found = false;

    function walk(node) {
        if (!node || found) return;

        const type = node.type;

        if (type === "text") {
            if (typeof node.text === "string" && node.text.trim() !== "") {
                found = true;
            }
            return;
        }

        if (type === "imageUpload") {
            if (node.attrs?.pending === true) found = true;
            return;
        }

        if (CONTENT_NODE_TYPES.has(type)) {
            found = true;
            return;
        }

        if (Array.isArray(node.content)) {
            for (const child of node.content) {
                walk(child);
                if (found) return;
            }
        }
    }

    walk(doc);
    return found;
}
