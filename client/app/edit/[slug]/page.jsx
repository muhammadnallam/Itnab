import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { Editor } from "@/components/editor/Editor";
import { handleArticleRead} from "@/lib/handlers";
import "@/styles/_variables.scss";

export default async function EditPage({ params }) {
    const { slug } = await params;
    const session = await authClient.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth");
    }

    const article = await handleArticleRead(slug);

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
