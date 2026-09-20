"use client";

import { useEffect } from "react";

const LOCK_CLASS = "editor-shell-lock";

/**
 * Pins a full-screen editor shell to the visual viewport.
 *
 * The virtual keyboard shrinks the visual viewport without resizing the layout
 * viewport, so `100dvh` and `position: fixed` alone cannot keep a shell aligned
 * to the visible area. This syncs the shell's height and top offset to
 * `window.visualViewport` and locks document scrolling while mounted.
 */
export function useEditorViewport(shellRef) {
    useEffect(() => {
        const el = shellRef.current;
        if (!el) return;

        const vv = window.visualViewport;
        const root = document.documentElement;

        root.classList.add(LOCK_CLASS);

        let frame = 0;

        const apply = () => {
            frame = 0;

            if (vv) {
                // Never fight pinch-zoom: leave the shell alone while zoomed.
                if (Math.abs((vv.scale || 1) - 1) > 0.01) return;
                el.style.height = `${vv.height}px`;
                el.style.top = `${vv.offsetTop}px`;
                return;
            }

            el.style.height = `${window.innerHeight}px`;
            el.style.top = "0px";
        };

        const schedule = () => {
            if (frame) return;
            frame = requestAnimationFrame(apply);
        };

        apply();

        vv?.addEventListener("resize", schedule);
        vv?.addEventListener("scroll", schedule);
        window.addEventListener("orientationchange", schedule);
        window.addEventListener("resize", schedule);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            vv?.removeEventListener("resize", schedule);
            vv?.removeEventListener("scroll", schedule);
            window.removeEventListener("orientationchange", schedule);
            window.removeEventListener("resize", schedule);
            root.classList.remove(LOCK_CLASS);
            el.style.height = "";
            el.style.top = "";
        };
    }, [shellRef]);
}
