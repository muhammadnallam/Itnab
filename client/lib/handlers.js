import { upload, publishArticle, getSession, signInEmail, signUpEmail} from "./api";

export async function handleArticle({ coverImage, content, seoTitle, seoDescription, tag, sendEmail, wordCount }) {
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
    else if (
        seoDescription.length > 160 ||
        seoDescription.length < 100
    )
        errors.seoDescription = "الوصف يجب أن يكون بين 100 إلى 160 حرفًا";

    if (!tag) errors.tag = "الموضوع مطلوب";

    if (wordCount < 500) {
        errors.wordCount = "يجب أن يحتوي المقال على 500 كلمة على الأقل";
        alert(errors.wordCount);
    }

    if (Object.keys(errors).length > 0) return { success: false, errors };

    try {
        const coverImageUrl = await upload(coverImage);
        const json = await publishArticle({
            content,
            data: { seoTitle, seoDescription, tag, sendEmail, coverImage: coverImageUrl },
        });
        return { success: true, slug: json.slug };
    } catch (err) {
        return { success: false, errors: { apiError: err.message || "Upload failed" } };
    }
}

// --- Auth ---

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
