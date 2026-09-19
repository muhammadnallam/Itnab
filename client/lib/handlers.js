import {
    getSession,
    requestPasswordReset,
    resetPassword,
    sendVerificationOtp,
    signInEmail,
    signUpEmail,
    verifyEmailOtp,
} from "./api/auth";
import { upload } from "./api/upload";
import { processContentImages } from "./processImages";
import { normalizeSocialUrl } from "@itnab/url";

export function validateArticleFields({
    coverImage,
    content,
    seoTitle,
    seoDescription,
    tag,
    wordCount,
}) {
    const errors = {};

    if (!coverImage) errors.coverImage = "صورة الغلاف مطلوبة";

    const firstNode = content?.content?.[0];
    const secondNode = content?.content?.[1];

    const getText = (node) =>
        node?.content
            ?.map((c) => (c.type === "text" ? c.text : ""))
            .join("")
            .trim() || "";

    if (
        !firstNode ||
        firstNode.type !== "articleTitle" ||
        !getText(firstNode)
    ) {
        errors.articleTitle = "عنوان المقال مطلوب";
    }

    if (
        !secondNode ||
        secondNode.type !== "articleDescription" ||
        !getText(secondNode)
    ) {
        errors.articleDescription = "وصف المقال مطلوب";
    }

    if (!seoTitle) errors.seoTitle = "عنوان محركات البحث مطلوب";
    else if (seoTitle.length > 60 || seoTitle.length < 30)
        errors.seoTitle = "العنوان يجب أن يكون بين 30 إلى 60 حرفًا";

    if (!seoDescription) errors.seoDescription = "وصف SEO مطلوب";
    else if (seoDescription.length > 160 || seoDescription.length < 100)
        errors.seoDescription = "الوصف يجب أن يكون بين 100 إلى 160 حرفًا";

    if (!tag) errors.tag = "الموضوع مطلوب";

    if (wordCount && wordCount < 500) {
        errors.wordCount = "يجب أن يحتوي المقال على 500 كلمة على الأقل";
    }

    return errors;
}

export async function prepareArticlePayload({
    coverImage,
    content,
    seoTitle,
    seoDescription,
    tag,
    sendEmail,
    wordCount,
}) {
    let coverImageUrl = coverImage;
    if (typeof coverImage !== "string") {
        const uploaded = await upload(coverImage, "article-covers");
        coverImageUrl = uploaded;
    }

    const processedContent = await processContentImages(content);

    return {
        content: processedContent,
        data: {
            seoTitle,
            seoDescription,
            tag,
            sendEmail,
            coverImage: coverImageUrl,
            wordCount,
        },
    };
}

export function safeRedirect(target, fallback = "/") {
    if (typeof target !== "string" || !target.startsWith("/")) return fallback;
    if (target.startsWith("//") || target.startsWith("/\\")) return fallback;
    if (target === "/auth" || target.startsWith("/auth?")) return fallback;
    return target;
}

export async function handleLogin(email, password, setUser) {
    try {
        await signInEmail(email, password);
        const session = await getSession();
        if (session?.user) setUser(session.user);
        return { success: true };
    } catch (err) {
        return {
            success: false,
            error: err.message || "فشل تسجيل الدخول",
            needsVerification: err.code === "EMAIL_NOT_VERIFIED",
            email,
        };
    }
}

export async function handleSignup(email, password, setUser) {
    try {
        const name = email.split("@")[0];
        const data = await signUpEmail(email, password, name);
        if (data?.token) {
            const session = await getSession();
            if (session?.user) setUser(session.user);
            return { success: true };
        }
        return { success: true, needsVerification: true, email };
    } catch (err) {
        return {
            success: false,
            error: err.message || "فشل إنشاء الحساب",
        };
    }
}

export async function handleVerifyOtp(email, otp, setUser) {
    try {
        await verifyEmailOtp(email, otp);
        const session = await getSession();
        if (session?.user) setUser(session.user);
        return { success: true };
    } catch (err) {
        return {
            success: false,
            error: err.message || "رمز التحقق غير صحيح",
        };
    }
}

export async function handleResendOtp(email) {
    try {
        await sendVerificationOtp(email, "email-verification");
        return { success: true };
    } catch (err) {
        return {
            success: false,
            error: err.message || "تعذر إرسال رمز التحقق",
        };
    }
}

export async function handleRequestReset(email) {
    try {
        const redirectTo =
            typeof window !== "undefined"
                ? `${window.location.origin}/reset-password`
                : undefined;
        await requestPasswordReset(email, redirectTo);
        return { success: true };
    } catch (err) {
        return {
            success: false,
            error: err.message || "تعذر إرسال رابط إعادة التعيين",
        };
    }
}

export async function handleResetPassword(newPassword, token) {
    try {
        await resetPassword(newPassword, token);
        return { success: true };
    } catch (err) {
        return {
            success: false,
            error: err.message || "تعذر إعادة تعيين كلمة المرور",
        };
    }
}

export function validatePasswordFields({
    currentPassword,
    newPassword,
    confirmPass,
}) {
    const errors = {};

    if (!currentPassword?.trim())
        errors.currentPass = "كلمة المرور الحالية مطلوبة";
    if (!newPassword?.trim()) errors.newPass = "كلمة المرور الجديدة مطلوبة";
    else if (newPassword.length < 8)
        errors.newPass = "كلمة المرور يجب أن تكون ٨ أحرف على الأقل";
    else if (newPassword.length > 64)
        errors.newPass = "كلمة المرور يجب أن تكون ٦٤ حرفًا كحد أقصى";
    if (!confirmPass?.trim()) errors.confirmPass = "تأكيد كلمة المرور مطلوب";
    else if (newPassword !== confirmPass)
        errors.confirmPass = "كلمتا المرور غير متطابقتين";

    return errors;
}

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

export function validateProfileFields({ name, username, bio, avatar, banner }) {
    const errors = {};

    if (!name?.trim()) errors.name = "الاسم مطلوب";
    if (!username?.trim()) errors.username = "اسم المستخدم مطلوب";
    else if (!/^[a-zA-Z0-9_]+$/.test(username))
        errors.username =
            "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط";

    if (avatar && typeof avatar !== "string" && avatar.size > MAX_IMAGE_SIZE)
        errors.avatar = "الحد الأقصى 3 ميغابايت";
    if (banner && typeof banner !== "string" && banner.size > MAX_IMAGE_SIZE)
        errors.banner = "الحد الأقصى 3 ميغابايت";

    return errors;
}

export function validateSocialLinks({ website, youtube, x }) {
    const errors = {};
    const values = {};

    for (const [key, raw] of [
        ["website", website],
        ["youtube", youtube],
        ["x", x],
    ]) {
        const { value, error } = normalizeSocialUrl(raw, key);
        if (error) errors[key] = error;
        else values[key] = value;
    }

    return { errors, values };
}

export async function handleInitSession(setUser, setLoading) {
    try {
        const session = await getSession();
        setUser(session?.user || null);
    } catch {
        setUser(null);
    } finally {
        setLoading?.(false);
    }
}