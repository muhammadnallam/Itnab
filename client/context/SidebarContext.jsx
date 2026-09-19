"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "itnab.sidebar";

export const SidebarContext = createContext(null);

function readStoredOpen() {
    if (typeof window === "undefined") return true;
    try {
        return window.localStorage.getItem(STORAGE_KEY) !== "0";
    } catch {
        return true;
    }
}

export default function SidebarProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(readStoredOpen);

    // Mirror the state onto <html> so CSS owns the actual layout. The inline
    // script in app/layout.jsx already set this before first paint; running it
    // again here keeps the attribute in sync with React after hydration.
    useEffect(() => {
        const root = document.documentElement;
        root.dataset.sidebar = sidebarOpen ? "open" : "closed";
        root.dataset.hydrated = "true";
    }, [sidebarOpen]);

    // Keep multiple tabs in sync.
    useEffect(() => {
        const onStorage = () => setSidebarOpen(readStoredOpen());
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => {
            const next = !prev;
            try {
                window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
            } catch {}
            return next;
        });
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
