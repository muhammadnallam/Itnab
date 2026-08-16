import { getSession, signInEmail, signUpEmail } from "./api/auth";
import { upload } from "./api/upload";
import { processContentImages } from "./processImages";

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

export async function handleUser(mode, email, password, setUser) {
    try {
        if (mode === "login") {
            await signInEmail(email, password);
            const session = await getSession();
            if (session?.user) setUser(session.user);
            return { success: true };
        }

        const name = email.split("@")[0];
        const data = await signUpEmail(email, password, name);
        if (data?.user) setUser(data.user);
        return { success: true };
    } catch (err) {
        return {
            success: false,
            error: err.message || "حدث خطأ ما من جانبنا. يرجى المحاولة لاحقًا",
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
    else if (newPassword.length > 20)
        errors.newPass = "كلمة المرور يجب أن تكون ٢٠ حرفًا كحد أقصى";
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