import { authClient } from "../auth-client";

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
    // const { error } = await authClient.signIn.social({ provider: "google" });
    // if (error) throw new Error(error.message || "فشل تسجيل الدخول عبر Google");
    throw new Error("التسجيل عبر Google غير متاح حاليًا");
}

export async function signOut() {
    await authClient.signOut();
}
