import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Editor } from "@/components/editor/Editor";
import { getArticleBySlug } from "@/lib/data/articles";
import "@/styles/_variables.scss";

export default async function EditPage({ params }) {
    const { slug } = await params;
    const { data: session } = await authClient.getSession({
        fetchOptions: {
            headers: await headers(),
        },
    });

    if (!session) {
        redirect("/auth");
    }

    let article;
    try {
        article = await getArticleBySlug(slug);
    } catch {
        notFound();
    }

    if (session.user.id !== article.authorId) {
        redirect("/");
    }

    const articleContent = {
        ...article.content,
        // articleTitle and articleDescription is deleted in article creation.
        content: [
            {
                type: "articleTitle",
                content: [{ type: "text", text: article.title }],
            },
            {
                type: "articleDescription",
                content: [{ type: "text", text: article.subtitle }],
            },
            ...(article.content.content || []),
        ],
    };

    const articleData = {
        id: article.id,
        slug: article.slug,
        seoTitle: article.seoTitle,
        seoDescription: article.seoSubtitle,
        tag: article.topic,
        coverImage: article.coverImage,
    };

    return (
        <Editor
            articleContent={articleContent}
            articleData={articleData}
            mode="update"
        />
    );
}
