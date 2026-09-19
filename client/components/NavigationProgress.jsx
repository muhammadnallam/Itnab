"use client";

import { useEffect } from "react";

const SHOW_DELAY = 120;
const SAFETY_TIMEOUT = 10000;

function isInternalNavigation(event) {
    if (event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return false;
    }

    const anchor = event.target?.closest?.("a[href]");
    if (!anchor) return false;
    if (anchor.hasAttribute("download")) return false;
    if (anchor.target && anchor.target !== "_self") return false;

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
    ) {
        return false;
    }

    return true;
}

export default function NavigationProgress() {
    useEffect(() => {
        const bar = document.getElementById("nav-progress");
        if (!bar) return undefined;

        let showTimer = null;
        let safetyTimer = null;
        let pollTimer = null;
        let hideTimer = null;
        let active = false;
        let startedHref = null;

        const clearTimers = () => {
            clearTimeout(showTimer);
            clearTimeout(safetyTimer);
            clearTimeout(hideTimer);
            clearInterval(pollTimer);
        };

        const finish = () => {
            clearTimers();
            active = false;
            startedHref = null;
            if (!bar.classList.contains("is-active")) return;
            bar.classList.add("is-done");
            hideTimer = setTimeout(() => {
                bar.classList.remove("is-active");
                bar.classList.remove("is-done");
            }, 320);
        };

        const start = () => {
            clearTimers();
            startedHref = window.location.href;
            active = true;
            bar.classList.remove("is-done");
            showTimer = setTimeout(() => {
                if (active) bar.classList.add("is-active");
            }, SHOW_DELAY);
            pollTimer = setInterval(() => {
                if (window.location.href !== startedHref) finish();
            }, 100);
            safetyTimer = setTimeout(finish, SAFETY_TIMEOUT);
        };

        const onClick = (event) => {
            if (!isInternalNavigation(event)) return;
            start();
        };

        document.addEventListener("click", onClick, true);
        window.addEventListener("popstate", finish);

        return () => {
            document.removeEventListener("click", onClick, true);
            window.removeEventListener("popstate", finish);
            clearTimers();
        };
    }, []);

    return <div id="nav-progress" className="nav-progress" aria-hidden="true" />;
}
