import { upload } from "./api";
import { getPendingImageFiles, clearPendingImageFiles } from "./tiptap-utils";

export async function processContentImages(content) {
    const pendingFiles = getPendingImageFiles();
    if (pendingFiles.size === 0) return content;

    const cloned = JSON.parse(JSON.stringify(content));

    async function walk(node) {
        if (node.type === "image" && node.attrs?.src?.startsWith("blob:")) {
            const file = pendingFiles.get(node.attrs.src);
            if (file) {
                URL.revokeObjectURL(node.attrs.src);
                node.attrs.src = await upload(file, "article-assets");
            }
        }
        if (node.content) {
            for (const child of node.content) {
                await walk(child);
            }
        }
    }

    await walk(cloned);
    clearPendingImageFiles();
    return cloned;
}
