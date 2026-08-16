import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { renderTipTap } from "@/lib/render-tiptap-html";
import ArticleHeader from "@/app/article/[slug]/ArticleHeader";
import ArticleView from "@/app/article/[slug]/ArticleView";
import { getQueryClient } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { getArticleBySlug } from "@/lib/data/articles";
import "./styles.css";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    try {
        const article = await getArticleBySlug(slug);
        return {
            title: article.seoTitle,
            description: article.seoSubtitle,
            openGraph: {
                title: article.seoTitle,
                description: article.seoSubtitle,
                images: [{ url: article.coverImage }],
            },
            keywords: [article.topic],
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
            <ArticleHeader />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ArticleView slug={slug} article={article} html={html} />
            </HydrationBoundary>
        </main>
    );
}