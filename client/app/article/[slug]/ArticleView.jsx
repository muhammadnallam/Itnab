"use client";

import { useArticle } from "@/hooks/useArticle";
import { Bookmark, MessageSquare, MoreHorizontal, Share, ThumbsDown, ThumbsUp } from "lucide-react";

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export default function ArticleView({ slug, article: initialArticle, html }) {
    const { article: cached } = useArticle(slug);
    const article = cached ?? initialArticle;

    if (!article) return null;

    const saved = false;

    return (
        <>
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
            <article>
                <div className="flex items-center justify-between border-b border-border pb-4 mb-10">
                    <div className="flex items-center gap-5 text-sm font-medium">
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
                        {formatDate(article.createdAt)}
                    </span>
                </div>
                <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
                <div className="flex items-center justify-between border-b border-t border-border pb-4 pt-4 mt-10">
                    <div className="flex items-center gap-5 text-sm text-gray-700 font-medium">
                        <button className="flex items-center gap-1.5 text-mid hover:text-ink">
                            <MoreHorizontal
                                size={19}
                                strokeWidth={1.75}
                                fill={saved ? "currentColor" : "none"}
                            />
                        </button>
                        <button className="flex items-center gap-1.5 text-mid hover:text-ink">
                            <Bookmark
                                size={19}
                                strokeWidth={1.75}
                                fill={saved ? "currentColor" : "none"}
                            />
                        </button>
                        <button className="flex items-center gap-1.5 text-mid hover:text-ink">
                            <Share
                                size={19}
                                strokeWidth={1.75}
                                fill={saved ? "currentColor" : "none"}
                            />
                        </button>
                    </div>
                    <div className="flex items-center gap-5 text-xs font-medium">
                        <button className="flex items-center gap-1.5 text-mid hover:text-ink">
                            512
                            <MessageSquare
                                size={19}
                                strokeWidth={1.75}
                                fill={saved ? "currentColor" : "none"}
                            />
                        </button>
                        <button className="flex items-center gap-1.5 text-mid hover:text-ink">
                            2k
                            <ThumbsDown
                                size={19}
                                strokeWidth={1.75}
                                fill={saved ? "currentColor" : "none"}
                            />
                        </button>
                        <button className="flex items-center gap-1.5 text-mid hover:text-ink">
                            14k
                            <ThumbsUp
                                size={19}
                                strokeWidth={1.75}
                                fill={saved ? "currentColor" : "none"}
                            />
                        </button>
                    </div>
                </div>
            </article>
        </>
    );
}