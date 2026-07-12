const { getSchema, Node } = require("@tiptap/core");
const { StarterKit } = require("@tiptap/starter-kit");
const { TaskList, TaskItem } = require("@tiptap/extension-list");
const { TextAlign } = require("@tiptap/extension-text-align");
const { Highlight } = require("@tiptap/extension-highlight");
const { Image } = require("@tiptap/extension-image");
const { Node: PMNode } = require("prosemirror-model");

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
    return doc;
}

module.exports = { validateDoc, schema, extensions };
