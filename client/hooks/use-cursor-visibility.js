"use client";
import { useWindowSize } from "@/hooks/use-window-size"
import { useBodyRect } from "@/hooks/use-element-rect"
import { useEffect } from "react"

/**
 * Custom hook that ensures the cursor remains visible when typing in a Tiptap editor.
 * Automatically scrolls the window when the cursor would be hidden by the toolbar.
 *
 * @param options.editor The Tiptap editor instance
 * @param options.overlayHeight Toolbar height to account for
 * @returns The bounding rect of the body
 */
export function useCursorVisibility({
  editor,
  overlayHeight = 0
}) {
  const { height: windowHeight } = useWindowSize()
  const rect = useBodyRect({
    enabled: true,
    throttleMs: 100,
    useResizeObserver: true,
  })

  useEffect(() => {
    const ensureCursorVisibility = () => {
      if (!editor) return

      const { state, view } = editor
      if (!view.hasFocus()) return

      const scrollContainer = view.dom.closest(".simple-editor-content")
      if (!scrollContainer) return

      const { from } = state.selection
      const cursorCoords = view.coordsAtPos(from)

      if (windowHeight < rect.height && cursorCoords) {
        const containerRect = scrollContainer.getBoundingClientRect()
        const cursorTopRelative = cursorCoords.top - containerRect.top
        const availableSpace = containerRect.height - cursorTopRelative

        if (availableSpace < overlayHeight) {
          const targetCursorY = Math.max(
            containerRect.height / 2,
            overlayHeight
          )
          const currentScrollY = scrollContainer.scrollTop
          const cursorAbsoluteY = cursorTopRelative + currentScrollY
          const newScrollY = cursorAbsoluteY - targetCursorY

          scrollContainer.scrollTo({
            top: Math.max(0, newScrollY),
            behavior: "smooth",
          })
        }
      }
    }

    ensureCursorVisibility()
  }, [editor, overlayHeight, windowHeight, rect.height])

  return rect
}
