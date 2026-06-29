"use client";

import { useEffect, useState } from "react";

export default function App() {
    const [status, setStatus] = useState("Loading...");

    useEffect(() => {
        fetch("http://localhost:3000/api/health")
            .then((res) => res.json())
            .then((data) => setStatus(`Server is ${data.status}`))
            .catch((err) => setStatus(`Error: ${err.message}`));
    }, []);

    return <h1>{status}</h1>;
}
