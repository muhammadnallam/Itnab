import { notFound } from "next/navigation";
import { renderTipTap } from "@/lib/render-tiptap-html";
import Avatar from "@/components/Avatar";
import ArticleHeader from "@/components/ArticleHeader";
import "./styles.css";
import { handleArticleRead } from "@/lib/handlers";

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
    const { slug } = await params;
    const article = await handleArticleRead(slug);
    if (!article) notFound();

    const title = article.title;
    const subtitle = article.subtitle;
    const readTime = article.readTime;
    const html = renderTipTap(article.content);
    const authorInitial = article.author?.name?.[0] || "?";

    return (
        <main className="article-page">
            <ArticleHeader />
            <div className="article-spacer" />
            <figure className="article-hero">
                <img src={article.coverImage} alt={title} />
            </figure>
            <article>
                <h1>{title}</h1>
                <p className="subhead">{subtitle}</p>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 36,
                        padding: "20px 0",
                        borderTop: "1px solid var(--color-border)",
                        borderBottom: "1px solid var(--color-border)",
                    }}
                    className="metadata"
                >
                    <Avatar
                        initials={authorInitial}
                        size={44}
                        bg="var(--color-accent)"
                    />
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                marginBottom: 4,
                                fontSize: 15,
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: 500,
                                    color: "var(--color-ink)",
                                }}
                            >
                                {article.author?.name}
                            </span>
                            <button
                                style={{
                                    background: "none",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 99,
                                    padding: "3px 12px",
                                    color: "var(--color-mid)",
                                    cursor: "pointer",
                                    fontWeight: 500,
                                    transition: "all 0.15s",
                                }}
                            >
                                {"متابعة"}
                            </button>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                color: "var(--color-mid)",
                            }}
                        >
                            <span>{article.topic}</span>
                            <span>·</span>
                            <span
                                style={{
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                }}
                                className="read-time"
                            >
                                {readTime} دقائق قراءة
                            </span>
                            <span>·</span>
                            <span className="date">
                                {formatDate(article.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </article>
        </main>
    );
}
