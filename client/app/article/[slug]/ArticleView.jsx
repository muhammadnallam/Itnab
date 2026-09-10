"use client";

import { useArticle } from "@/hooks/useArticle";
import { useLikes } from "@/hooks/useLikes";
import { useSave } from "@/hooks/useSave";
import { useView } from "@/hooks/useView";
import { useState, useRef } from "react";
import RequireAuth from "@/components/RequireAuth";
import ShareModal from "@/components/ShareModal";
import {
    Bookmark,
    MessageSquare,
    MoreHorizontal,
    Share,
    ThumbsDown,
    ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import CommentsSection from "@/components/comments/CommentsSection";

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

const formatCount = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "k";
    return String(n);
};

export default function ArticleView({ slug, article: initialArticle, html }) {
    const { article: cached } = useArticle(slug);
    const article = cached ?? initialArticle;
    const likes = useLikes(article?.id);
    const save = useSave(article?.id);
    useView(article?.id);
    const [shareOpen, setShareOpen] = useState(false);
    const commentsRef = useRef(null);

    if (!article) return null;

    const saved = save.saved;

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
                    <Link
                        href={`/@${article.author?.username}`}
                        className="underline hover:text-accent"
                    >
                        {article.author?.name}
                    </Link>
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
                        <RequireAuth onClick={save.toggle}>
                            <button
                                className={`flex items-center gap-1.5 ${
                                    saved
                                        ? "text-accent"
                                        : "text-mid hover:text-ink"
                                }`}
                                style={{
                                    background: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <Bookmark
                                    size={19}
                                    strokeWidth={1.75}
                                    fill={saved ? "currentColor" : "none"}
                                />
                                حفظ{" "}
                            </button>
                        </RequireAuth>
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
                        <RequireAuth onClick={save.toggle}>
                            <button
                                className={`flex items-center gap-1.5 ${
                                    saved
                                        ? "text-accent"
                                        : "text-mid hover:text-ink"
                                }`}
                                style={{
                                    background: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <Bookmark
                                    size={19}
                                    strokeWidth={1.75}
                                    fill={saved ? "currentColor" : "none"}
                                />
                            </button>
                        </RequireAuth>
                        <button
                            onClick={() => setShareOpen(true)}
                            className="flex items-center gap-1.5 text-mid hover:text-ink"
                        >
                            <Share size={19} strokeWidth={1.75} />
                        </button>
                    </div>
                    <div className="flex items-center gap-5 text-xs font-medium">
                        <button
                            onClick={() =>
                                commentsRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                })
                            }
                            className="flex items-center gap-1.5 text-mid hover:text-ink"
                        >
                            {formatCount(article.commentCount ?? 0)}
                            <MessageSquare size={19} strokeWidth={1.75} />
                        </button>
                        <RequireAuth
                            onClick={
                                likes.type === "DISLIKE"
                                    ? likes.clear
                                    : likes.dislike
                            }
                        >
                            <button
                                className={`flex items-center gap-1.5 ${
                                    likes.type === "DISLIKE"
                                        ? "text-accent"
                                        : "text-mid hover:text-ink"
                                }`}
                                style={{
                                    background: "none",
                                    cursor: "pointer",
                                }}
                            >
                                {formatCount(likes.dislikeCount)}
                                <ThumbsDown
                                    size={19}
                                    strokeWidth={1.75}
                                    fill={
                                        likes.type === "DISLIKE"
                                            ? "currentColor"
                                            : "none"
                                    }
                                />
                            </button>
                        </RequireAuth>
                        <RequireAuth
                            onClick={
                                likes.type === "LIKE" ? likes.clear : likes.like
                            }
                        >
                            <button
                                className={`flex items-center gap-1.5 ${
                                    likes.type === "LIKE"
                                        ? "text-accent"
                                        : "text-mid hover:text-ink"
                                }`}
                                style={{
                                    background: "none",
                                    cursor: "pointer",
                                }}
                            >
                                {formatCount(likes.likeCount)}
                                <ThumbsUp
                                    size={19}
                                    strokeWidth={1.75}
                                    fill={
                                        likes.type === "LIKE"
                                            ? "currentColor"
                                            : "none"
                                    }
                                />
                            </button>
                        </RequireAuth>
                    </div>
                </div>
            </article>

            <CommentsSection
                articleId={article.id}
                authorId={article.author?.id}
                sectionRef={commentsRef}
            />

            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                articleId={article.id}
                url={typeof window !== "undefined" ? window.location.href : ""}
                heading="مشاركة المقال"
                subheading="القراءة أكثر إفادةً عندما نشاركها مع الآخرين"
            />
        </>
    );
}
