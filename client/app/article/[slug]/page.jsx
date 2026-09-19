import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { renderTipTap } from "@/lib/render-tiptap-html";
import ArticleHeader from "@/app/article/[slug]/ArticleHeader";
import ArticleView from "@/app/article/[slug]/ArticleView";
import { getQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getArticleBySlug } from "@/lib/data/articles";
import { resolveOgImage } from "@/lib/og-image";
import "./styles.css";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    try {
        const article = await getArticleBySlug(slug);
        const image = resolveOgImage(article.coverImage, article.title);
        const url = `/article/${article.slug}`;

        return {
            title: article.seoTitle,
            description: article.seoSubtitle,
            keywords: [article.topic],
            alternates: { canonical: url },
            authors: article.author?.name
                ? [{ name: article.author.name }]
                : undefined,
            openGraph: {
                type: "article",
                url,
                title: article.seoTitle,
                description: article.seoSubtitle,
                siteName: "إطناب",
                locale: "ar_AR",
                publishedTime: article.createdAt,
                modifiedTime: article.updatedAt,
                authors: article.author?.name
                    ? [article.author.name]
                    : undefined,
                section: article.topic,
                tags: [article.topic],
                images: [image],
            },
            twitter: {
                card: "summary_large_image",
                title: article.seoTitle,
                description: article.seoSubtitle,
                images: [image.url],
            },
        };
    } catch {
        return {};
    }
}

export default async function ArticlePage({ params }) {
    const { slug } = await params;

    const queryClient = getQueryClient();
    let article;
    try {
        article = await getArticleBySlug(slug);
    } catch {
        notFound();
    }
    queryClient.setQueryData(queryKeys.article(slug), article);

    const html = renderTipTap(article.content);

    return (
        <main className="article-page overflow-x-hidden">
            <ArticleHeader article={article} />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ArticleView slug={slug} article={article} html={html} />
            </HydrationBoundary>
        </main>
    );
}