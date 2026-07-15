import { getSchema, Node } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { Node as PMNode } from "prosemirror-model";

const ArticleTitle = Node.create({
    name: "articleTitle",
    group: "block",
    content: "text*",
    marks: "",
    defining: true,
});

const ArticleDescription = Node.create({
    name: "articleDescription",
    group: "block",
    content: "text*",
    marks: "",
    defining: true,
});

const ImageUpload = Node.create({
    name: "imageUpload",
    group: "block",
    atom: true,
    draggable: true,
    selectable: true,
    addAttributes() {
        return {
            accept: { default: "image/*" },
            limit: { default: 1 },
            maxSize: { default: 0 },
        };
    },
});

const extensions = [
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
];

const schema = getSchema(extensions);

function validateDoc(json) {
    const doc = PMNode.fromJSON(schema, json);
    doc.check();

    const first = doc.firstChild;
    if (
        !first ||
        first.type.name !== "articleTitle" ||
        !first.textContent.trim()
    ) {
        throw new Error("Article title cannot be empty");
    }

    const second = doc.child(1);
    if (
        !second ||
        second.type.name !== "articleDescription" ||
        !second.textContent.trim()
    ) {
        throw new Error("Article description cannot be empty");
    }

    return doc;
}

export { validateDoc, schema, extensions };
