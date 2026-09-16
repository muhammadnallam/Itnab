"use client";

import { useSyncExternalStore, createContext } from "react";

export const WidthContext = createContext(1200);

function subscribe(callback) {
    window.addEventListener("resize", callback, { passive: true });
    return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
    return window.innerWidth;
}

function getServerSnapshot() {
    return 1200;
}

export default function ScreenProvider({ children }) {
    const width = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    return (
        <WidthContext.Provider value={width}>{children}</WidthContext.Provider>
    );
}
