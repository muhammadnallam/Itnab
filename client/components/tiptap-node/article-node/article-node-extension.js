import { Node, mergeAttributes } from "@tiptap/core"
import { TextSelection } from "@tiptap/pm/state"

export const ArticleTitle = Node.create({
  name: "articleTitle",

  group: "block",

  content: "text*",

  marks: "",

  defining: true,

  selectable: false,

  parseHTML() {
    return [{ tag: 'h1[data-protected="title"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "h1",
      mergeAttributes(HTMLAttributes, {
        "data-protected": "title",
        class: "article-title",
      }),
      0,
    ]
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection, doc } = editor.state
        const { $from } = selection

        if ($from.parent.type.name !== this.name) return false

        const descPos = $from.after() + 1
        const resolved = doc.resolve(descPos)

        if (resolved.parent.type.name === "articleDescription") {
          const { tr } = editor.state
          editor.view.dispatch(
            tr
              .setSelection(new TextSelection(resolved, resolved.end()))
              .scrollIntoView(),
          )
          return true
        }

        return false
      },
    }
  },
})

export const ArticleDescription = Node.create({
  name: "articleDescription",

  group: "block",

  content: "text*",

  marks: "",

  defining: true,

  selectable: false,

  parseHTML() {
    return [{ tag: 'p[data-protected="description"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes(HTMLAttributes, {
        "data-protected": "description",
        class: "article-description",
      }),
      0,
    ]
  },
})
