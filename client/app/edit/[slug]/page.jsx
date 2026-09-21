import { notFound } from "next/navigation";
import { Editor } from "@/components/editor/Editor";
import { getArticleBySlug } from "@/lib/data/articles";
import "@/styles/_variables.scss";

export const metadata = {
    title: "تعديل المقال",
    robots: { index: false, follow: false },
};

export default async function EditPage({ params }) {
    const { slug } = await params;

    let article;
    try {
        article = await getArticleBySlug(slug);
    } catch {
        notFound();
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
        authorId: article.authorId ?? article.author?.id,
        authorUsername: article.author?.username,
        authorName: article.author?.name,
        authorImage: article.author?.image,
        createdAt: article.createdAt,
    };

    return (
        <Editor
            articleContent={articleContent}
            articleData={articleData}
            mode="update"
        />
    );
}
