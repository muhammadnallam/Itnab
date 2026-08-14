"use client";

import { createContext, useContext, useState } from "react";
import AuthModal from "@/components/AuthModal";

export const AuthModalContext = createContext(null);

export default function AuthModalProvider({ children }) {
    const [state, setState] = useState({ open: false, mode: "login" });

    const openAuth = (mode = "login") =>
        setState((s) => ({ open: true, mode }));

    const closeAuth = () => setState((s) => ({ open: false, mode: s.mode }));

    return (
        <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
            {children}
            <AuthModal
                open={state.open}
                defaultMode={state.mode}
                onClose={closeAuth}
            />
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error("useAuthModal must be used within an AuthModalProvider");
    }
    return context;
}
