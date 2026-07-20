"use client";

import { createContext, useEffect, useState } from "react";
import { handleInitSession } from "@/lib/handlers";

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        handleInitSession(setUser);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
