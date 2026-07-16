"use client";

import { createContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

export const UserContext = createContext(null);

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        authClient
            .getSession()
            .then(({ data }) => {
                setUser(data?.user || null);
            })
            .catch(() => setUser(null));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
