import { generateHTML } from "@tiptap/html";
import { extensions } from "@itnab/tiptap";

export function renderTipTap(json) {
    return generateHTML(json, extensions);
}
