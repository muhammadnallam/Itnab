import { notFound } from "next/navigation";
import { renderTipTap } from "@/lib/render-tiptap-html";
import Avatar from "@/components/ui/Avatar";
import ArticleHeader from "@/app/article/[slug]/ArticleHeader";
import "./styles.css";
import { handleArticleRead } from "@/lib/handlers";
import { Share2, Bookmark } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Ltr = ({ children }) => (
    <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
        {children}
    </span>
);

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const article = await handleArticleRead(slug);
    if (!article) return {};
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
}

export default async function ArticlePage({ params }) {
    const saved = false;
    const { slug } = await params;
    const article = await handleArticleRead(slug);
    if (!article) notFound();

    const title = article.title;
    const subtitle = article.subtitle;
    const readTime = article.readTime;
    const html = renderTipTap(article.content);
    const authorInitial = article.author?.name?.[0] || "?";

    return (
        <main className="article-page overflow-x-hidden">
            <ArticleHeader />
            <div className="article-spacer" />
            <main className="max-w-2xl mx-auto px-5 md:px-0 pt-8 md:pt-14">
                <p className="text-accent tracking-widest font-bold mb-4">
                    {article.topic}
                </p>
                <h1 className="text-4xl md:text-6xl leading-tight font-normal mb-5">
                    {article.title}
                </h1>
                <p className="text-xl md:text-2xl text-mid leading-snug mb-6">
                    {article.subtitle}
                </p>
                <p className="mb-8 md:mb-10">
                    من{" "}
                    <a href="#" className="underline hover:text-accent">
                        {article.author?.name}
                    </a>
                </p>
            </main>
            <div className="relative left-1/2 -translate-x-1/2 w-screen">
                <figure className="mx-auto" style={{ maxWidth: "980px" }}>
                    <img
                        src={article.coverImage}
                        alt={article.title}
                        className="hero-img"
                    />
                </figure>
            </div>
            {/* <figure className="article-hero">
                <img src={article.coverImage} alt={title} />
                </figure> */}
            <article>
                <div className="flex items-center justify-between border-b border-gray-300 pb-4 mb-10">
                    <div className="flex items-center gap-5 ui-font text-xs text-gray-700 uppercase font-medium">
                        <button className="flex items-center gap-1.5 text-mid hover:text-ink">
                            <Bookmark
                                size={19}
                                strokeWidth={1.75}
                                fill={saved ? "currentColor" : "none"}
                            />
                            حفظ{" "}
                        </button>
                    </div>
                    <span className="text-sm tracking-widetext-ink">
                        {article.createdAt}
                    </span>
                </div>
                <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </article>
        </main>
    );
}
