import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"

export const ProtectedNodes = Extension.create({
  name: "protectedNodes",

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { selection } = editor.state
        const { $from } = selection

        if ($from.parentOffset === 0) {
          const parent = $from.parent
          if (
            parent.type.name === "articleTitle" ||
            parent.type.name === "articleDescription"
          ) {
            return true
          }
        }

        return false
      },

      Delete: ({ editor }) => {
        const { selection } = editor.state
        const { $to } = selection

        if ($to.parentOffset === $to.parent.content.size) {
          const parent = $to.parent
          if (
            parent.type.name === "articleTitle" ||
            parent.type.name === "articleDescription"
          ) {
            return true
          }
        }

        return false
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("protectedNodes"),
        filterTransaction: (tr) => {
          if (!tr.docChanged) return true

          const before = tr.before
          const after = tr.doc

          const oldTitle = before.firstChild
          const oldDesc = before.childCount > 1 ? before.child(1) : null

          const newTitle = after.firstChild
          const newDesc = after.childCount > 1 ? after.child(1) : null

          if (
            oldTitle?.type.name === "articleTitle" &&
            oldDesc?.type.name === "articleDescription"
          ) {
            if (
              newTitle?.type.name !== "articleTitle" ||
              newDesc?.type.name !== "articleDescription"
            ) {
              return false
            }
          }

          return true
        },
      }),
    ]
  },
})
