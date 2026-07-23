import { getSchema } from "@tiptap/core";
import { Node as PMNode } from "prosemirror-model";
import { extensions } from "@itnab/tiptap";

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
        throw new Error("عنوان المقال لا يمكن أن يكون خاليًا");
    }

    const second = doc.child(1);
    if (
        !second ||
        second.type.name !== "articleDescription" ||
        !second.textContent.trim()
    ) {
        throw new Error("وصف المقال لا يمكن أن يكون خاليًا");
    }

    return doc;
}

export { validateDoc, schema, extensions };
