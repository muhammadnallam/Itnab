import { API_URL } from "./config";

export async function upload(file, folder) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/api/upload/${folder}`, {
        credentials: "include",
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload failed");
    }

    const data = await res.json();
    return data.url;
}
