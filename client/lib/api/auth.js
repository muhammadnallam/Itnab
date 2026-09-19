import { authClient } from "../auth-client";

function toError(error, fallback) {
    const err = new Error(error?.message || fallback);
    if (error?.code) err.code = error.code;
    return err;
}

export async function getSession() {
    const { data } = await authClient.getSession();
    return data;
}

export async function signInEmail(email, password) {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error) throw toError(error, "فشل تسجيل الدخول");
    return data;
}

export async function signUpEmail(email, password, name) {
    const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
    });
    if (error) throw toError(error, "فشل إنشاء الحساب");
    return data;
}

export async function sendVerificationOtp(email, type = "email-verification") {
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type,
    });
    if (error) throw toError(error, "تعذر إرسال رمز التحقق");
    return data;
}

export async function verifyEmailOtp(email, otp) {
    const { data, error } = await authClient.emailOtp.verifyEmail({
        email,
        otp,
    });
    if (error) throw toError(error, "رمز التحقق غير صحيح");
    return data;
}

export async function requestPasswordReset(email, redirectTo) {
    const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo,
    });
    if (error) throw toError(error, "تعذر إرسال رابط إعادة التعيين");
    return data;
}

export async function resetPassword(newPassword, token) {
    const { data, error } = await authClient.resetPassword({
        newPassword,
        token,
    });
    if (error) throw toError(error, "تعذر إعادة تعيين كلمة المرور");
    return data;
}

export async function signOut() {
    await authClient.signOut();
}
