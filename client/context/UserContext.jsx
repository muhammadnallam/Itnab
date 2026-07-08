"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Not give the user access until its authentication state is fetched
export const UserContext = createContext(null);
// TODO: Add a loading animation while verifying authentication status. Unauthenticated content flashes

export default function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/auth/me", { credentials: "include" })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error(res.status);
                }
                return res.json();
            })
            .then((data) => {
                setUser(data || null);
            })
            .catch(() => setUser(null));
    }, []);

    return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
}

// export function useUser() {
//     return useContext(UserContext);
// }
