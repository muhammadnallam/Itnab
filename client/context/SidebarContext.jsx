"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

const STORAGE_KEY = "itnab.sidebar";

const getSnapshot = () => {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
};

const getServerSnapshot = () => null;

const subscribe = (callback) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
};

export const SidebarContext = createContext(null);

export default function SidebarProvider({ children }) {
    const stored = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );
    const sidebarOpen = stored !== "0";

    const toggleSidebar = () => {
        const next = sidebarOpen ? "0" : "1";
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {}
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
