import { Node, mergeAttributes } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";

export const ArticleTitle = Node.create({
    name: "articleTitle",
    group: "block",
    content: "text*",
    marks: "",
    defining: true,
    selectable: false,

    parseHTML() {
        return [{ tag: 'h1[data-protected="title"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "h1",
            mergeAttributes(HTMLAttributes, {
                "data-protected": "title",
                class: "article-title",
            }),
            0,
        ];
    },

    addKeyboardShortcuts() {
        return {
            Enter: ({ editor }) => {
                const { selection, doc } = editor.state;
                const { $from } = selection;

                if ($from.parent.type.name !== this.name) return false;

                const descPos = $from.after() + 1;
                const resolved = doc.resolve(descPos);

                if (resolved.parent.type.name === "articleDescription") {
                    const { tr } = editor.state;
                    editor.view.dispatch(
                        tr
                            .setSelection(
                                new TextSelection(resolved, resolved.end()),
                            )
                            .scrollIntoView(),
                    );
                    return true;
                }

                return false;
            },
        };
    },
});

export const ArticleDescription = Node.create({
    name: "articleDescription",
    group: "block",
    content: "text*",
    marks: "",
    defining: true,
    selectable: false,

    parseHTML() {
        return [{ tag: 'p[data-protected="description"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "p",
            mergeAttributes(HTMLAttributes, {
                "data-protected": "description",
                class: "article-description",
            }),
            0,
        ];
    },
});

export const ImageUpload = Node.create({
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

export const QuranVerse = Node.create({
    name: "quranVerse",
    group: "inline",
    inline: true,
    atom: true,
    selectable: true,
    draggable: false,

    addAttributes() {
        return {
            verseText: { default: "" },
            surahName: { default: "" },
            verseNumber: { default: 0 },
        };
    },

    parseHTML() {
        return [{ tag: 'span[data-type="quran-verse"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "span",
            mergeAttributes(HTMLAttributes, {
                "data-type": "quran-verse",
                class: "quran-verse",
            }),
            [
                "span",
                { class: "quran-verse-text" },
                "﴿ " + HTMLAttributes.verseText + " ﴾",
            ],
            [
                "span",
                { class: "quran-verse-ref" },
                "[ " + HTMLAttributes.surahName + ": " + HTMLAttributes.verseNumber + " ]",
            ],
        ];
    },
});
