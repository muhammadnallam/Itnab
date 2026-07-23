import { QuranVerse } from "@itnab/tiptap";
import { mergeAttributes } from "@tiptap/react";

export const QuranVerseNode = QuranVerse.extend({
    name: "quranVerse",

    addCommands() {
        return {
            insertQuranVerse:
                ({ verseText, surahName, verseNumber }) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: { verseText, surahName, verseNumber },
                    });
                },
        };
    },
});

export default QuranVerseNode;
