const SAFE_PROTOCOLS = /^(https?:|mailto:)/i;
const MAX_NESTING = 20;
const MAX_NODES = 2000;

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

        if (node.marks) {
            node.marks = node.marks.filter((mark) => {
                if (mark.type === "link" && mark.attrs?.href) {
                    return SAFE_PROTOCOLS.test(mark.attrs.href.trim());
                }
                return true;
            });
        }

        if (node.content) {
            node.content = node.content.map((child) =>
                walk(child, depth + 1),
            );
        }

        return node;
    }

    return walk(JSON.parse(JSON.stringify(json)), 0);
}

module.exports = { sanitizeDoc };
