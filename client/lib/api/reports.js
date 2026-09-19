import { fetcher } from "@/lib/fetcher";

export function submitReport(payload) {
    return fetcher("/api/report", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(payload),
    });
}
