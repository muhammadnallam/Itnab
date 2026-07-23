import { StarterKit } from "@tiptap/starter-kit";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import {
    ArticleTitle,
    ArticleDescription,
    ImageUpload,
    QuranVerse,
} from "./nodes.js";

export const extensions = [
    StarterKit.configure({
        link: { openOnClick: false },
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Highlight.configure({ multicolor: true }),
    Image,
    ArticleTitle,
    ArticleDescription,
    ImageUpload,
    QuranVerse,
];
