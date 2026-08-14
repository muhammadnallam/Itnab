"use client";

import { createContext, useEffect, useState } from "react";
import { handleInitSession } from "@/lib/handlers";

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        handleInitSession(setUser, setLoading);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}
