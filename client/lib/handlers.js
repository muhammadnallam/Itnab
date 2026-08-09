import { notFound } from "next/navigation";
import { getSession, signInEmail, signUpEmail } from "./api/auth";
import { upload } from "./api/upload";
import { publishArticle, updateArticle, getArticle } from "./api/article";
import { updateProfile, updateSocialLinks, updatePassword } from "./api/user";
import { processContentImages } from "./processImages";

export async function handleArticle({
    coverImage,
    content,
    seoTitle,
    seoDescription,
    tag,
    sendEmail,
    wordCount,
    mode,
    articleId,
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
        alert(errors.articleTitle);
    }

    if (
        !secondNode ||
        secondNode.type !== "articleDescription" ||
        !getText(secondNode)
    ) {
        errors.articleDescription = "وصف المقال مطلوب";
        alert(errors.articleDescription);
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
        alert(errors.wordCount);
    }

    if (Object.keys(errors).length > 0) return { success: false, errors };

    try {
        const isUpdate = mode === "update";
        let coverImageUrl = coverImage;

        if (isUpdate && typeof coverImage === "string") {
            // Existing URL -> skip upload
        } else {
            const uploaded = await upload(coverImage, "article-covers");
            coverImageUrl = uploaded;
        }

        const processedContent = await processContentImages(content);

        if (isUpdate) {
            await updateArticle({
                content: processedContent,
                data: {
                    seoTitle,
                    seoDescription,
                    tag,
                    sendEmail,
                    coverImage: coverImageUrl,
                    wordCount,
                },
                articleId,
            });
            return { success: true };
        }

        const json = await publishArticle({
            content: processedContent,
            data: {
                seoTitle,
                seoDescription,
                tag,
                sendEmail,
                coverImage: coverImageUrl,
                wordCount,
            },
        });
        return { success: true, slug: json.slug };
    } catch (err) {
        return {
            success: false,
            errors: {
                apiError:
                    err.message ||
                    (isUpdate
                        ? "حدث خطأ أثناء حفظ المقال"
                        : "حدث خطأ أثناء نشر المقال"),
            },
        };
    }
}

export async function handleArticleRead(slug) {
    try {
        const article = await getArticle(slug);
        return article;
    } catch (e) {
        throw notFound();
    }
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

export async function handlePassword({
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

    if (Object.keys(errors).length > 0) return errors;

    try {
        await updatePassword({ currentPassword, newPassword });
        return {};
    } catch (err) {
        return { apiError: err.message || "حدث خطأ أثناء تحديث كلمة المرور" };
    }
}

const MAX_IMAGE_SIZE = 3 * 1024 * 1024;

export async function handleProfile({ name, username, bio, avatar, banner }) {
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

    if (Object.keys(errors).length > 0) return errors;

    try {
        let avatarUrl = avatar;
        if (avatar && typeof avatar !== "string")
            avatarUrl = await upload(avatar, "avatars");

        let bannerUrl = banner;
        if (banner && typeof banner !== "string")
            bannerUrl = await upload(banner, "banners");

        const profile = await updateProfile({
            name,
            username,
            bio,
            avatarUrl,
            bannerUrl,
        });
        return { profile };
    } catch (err) {
        console.log({ name, username, bio, avatar, banner });
        return { apiError: err.message || "حدث خطأ أثناء تحديث الملف الشخصي" };
    }
}

export async function handleSocialLinks({ website, youtube, x }) {
    try {
        await updateSocialLinks({ socialLinks: { website, youtube, x } });
        return {};
    } catch (err) {
        return { apiError: err.message || "حدث خطأ أثناء تحديث الروابط" };
    }
}

export async function handleInitSession(setUser) {
    try {
        const session = await getSession();
        setUser(session?.user || null);
    } catch {
        setUser(null);
    }
}
