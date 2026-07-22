import { authClient } from "./auth-client";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getSession() {
    const { data } = await authClient.getSession();
    return data;
}

export async function signInEmail(email, password) {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw new Error(error.message || "فشل تسجيل الدخول");
    return data;
}

export async function signUpEmail(email, password, name) {
    const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
    });
    if (error) throw new Error(error.message || "فشل إنشاء الحساب");
    return data;
}

export async function signInGoogle() {
    const { error } = await authClient.signIn.social({ provider: "google" });
    if (error) throw new Error(error.message || "فشل تسجيل الدخول عبر Google");
}

export async function signOut() {
    await authClient.signOut();
}

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

export async function publishArticle({ content, data }) {
    const res = await fetch(`${API_URL}/api/article/create`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ content, data }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "حدث خطأ أثناء نشر المقال");
    return json;
}

export async function getArticle(slug) {
    const res = await fetch(`${API_URL}/api/article/${slug}`, {
        // Limits fetches and db queries by saving articles in cache, any request after 300s, it will be refetched.
        // next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error("المقال غير موجود");
    return res.json();
}

export async function updateArticle({ content, data, articleId }) {
    const res = await fetch(`${API_URL}/api/article/update`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({ content, data, articleId }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "حدث خطأ أثناء تعديل المقال");
    return json;
}
