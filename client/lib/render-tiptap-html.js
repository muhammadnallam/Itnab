import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import {
    ArticleTitle,
    ArticleDescription,
} from "@/components/tiptap-node/article-node/article-node-extension";

const extensions = [
    StarterKit.configure({ link: { openOnClick: false } }),
    TaskList,
    TaskItem.configure({ nested: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Highlight.configure({ multicolor: true }),
    Image,
    ArticleTitle,
    ArticleDescription,
];

export function renderTipTap(json) {
    return generateHTML(json, extensions);
}
