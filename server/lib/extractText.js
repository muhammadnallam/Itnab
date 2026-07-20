export default function extractText(doc) {
    let result = "";

    function walk(node) {
        if (node.type === "text") {
            result += node.text;
        }
        if (node.content) {
            for (const child of node.content) {
                walk(child);
            }
        }
    }

    walk(doc);
    return result;
}