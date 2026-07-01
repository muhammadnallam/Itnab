// A temporary API testing page

import { redirect, RedirectType } from "next/navigation";

export default async function Health() {
    let data;
    try {
        const res = await fetch("http://localhost:3000/api/health");
        data = await res.json();
    } catch (e) {
        return <p>Error: {e.message}</p>
    } finally {
        if (data.status === "ok") {
            redirect("/feed");
        } else {
            return <p>Status: {data.status}</p>;
        }
    }
}