import { API_URL } from "@/lib/api/config";

export async function fetcher(url, options) {
    const res = await fetch(
        url.startsWith("http") ? url : `${API_URL}${url}`,
        options,
    );
    if (!res.ok) {
        const error = new Error("حدث خطأ أثناء جلب البيانات من الخادم.");
        error.status = res.status;
        try {
            error.info = await res.json();
        } catch {
            error.info = null;
        }
        if (error.info?.error) error.message = error.info.error;
        throw error;
    }
    return res.json();
}