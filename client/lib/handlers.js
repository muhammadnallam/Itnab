import { notFound } from "next/navigation";
import {
    upload,
    publishArticle,
    updateArticle,
    getArticle,
    getSession,
    signInEmail,
    signUpEmail,
} from "./api";
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
                    err.message || isUpdate
                        ? "حدث خطأ أثناء حفظ المقال"
                        : "حدث خطأ أثناء نشر المقال",
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

export async function handleInitSession(setUser) {
    try {
        const session = await getSession();
        setUser(session?.user || null);
    } catch {
        setUser(null);
    }
}
