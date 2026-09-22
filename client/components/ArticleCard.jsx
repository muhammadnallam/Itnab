"use client";

import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Avatar from "@/components/ui/Avatar";
import RequireAuth from "@/components/RequireAuth";
import ArticleMoreMenu from "@/components/article/ArticleMoreMenu";
import { Bookmark, Ellipsis } from "lucide-react";
import { queryKeys } from "@/lib/query-keys";
import { saveArticle, unsaveArticle } from "@/lib/api/interactions";
import { UserContext } from "@/context/UserContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { toast } from "sonner";
import Link from "next/link";

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapArticles(data, mapper) {
    if (!data) return data;
    if (Array.isArray(data.pages)) {
        return {
            ...data,
            pages: data.pages.map((page) => ({
                ...page,
                items: page.items?.map(mapper),
            })),
        };
    }
    if (Array.isArray(data)) return data.map(mapper);
    return data;
}

function filterArticle(data, articleId) {
    if (!data) return data;
    if (Array.isArray(data.pages)) {
        return {
            ...data,
            pages: data.pages.map((page) => ({
                ...page,
                items: page.items?.filter((a) => a.id !== articleId),
            })),
        };
    }
    return data;
}

const LIBRARY_KEYS = ["userSaves", "userViews"];

const ArticleCard = ({ article }) => {
    const id = article?.id;
    const saved = article?.saved ?? false;
    const qc = useQueryClient();

    const { user, loading: userLoading } = useContext(UserContext);
    const { isAdmin } = useIsAdmin();

    const isOwner =
        isAdmin ||
        (!userLoading &&
            Boolean(user) &&
            user.username === article.authorUsername);

    const mutation = useMutation({
        mutationFn: (save) => (save ? saveArticle(id) : unsaveArticle(id)),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: queryKeys.allArticles() });
            const previousArticles = qc.getQueriesData({
                queryKey: queryKeys.allArticles(),
            });
            qc.setQueriesData({ queryKey: queryKeys.allArticles() }, (data) =>
                mapArticles(data, (a) =>
                    a.id === id ? { ...a, saved: !saved } : a,
                ),
            );

            const previousLibrary = [];
            for (const prefix of LIBRARY_KEYS) {
                await qc.cancelQueries({ queryKey: [prefix] });
                const prev = qc.getQueriesData({ queryKey: [prefix] });
                previousLibrary.push(...prev);

                if (prefix === "userSaves" && saved) {
                    qc.setQueriesData({ queryKey: [prefix] }, (data) =>
                        filterArticle(data, id),
                    );
                } else {
                    qc.setQueriesData({ queryKey: [prefix] }, (data) =>
                        mapArticles(data, (a) =>
                            a.id === id ? { ...a, saved: !saved } : a,
                        ),
                    );
                }
            }

            return { previous: [...previousArticles, ...previousLibrary] };
        },
        onSuccess: (_data, save) => {
            qc.invalidateQueries({ queryKey: ["list"] });
            if (save) {
                toast.success("تم حفظ المقال");
            } else {
                toast.success("تم إزالة الحفظ", {
                    duration: 5000,
                    action: {
                        label: "تراجع",
                        onClick: () => mutation.mutate(true),
                    },
                });
            }
        },
        onError: (err, _vars, context) => {
            context.previous.forEach(([queryKey, data]) =>
                qc.setQueryData(queryKey, data),
            );
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        },
    });

    const toggleSave = () => {
        if (!UUID_RE.test(id ?? "")) return;
        mutation.mutate(!saved);
    };

    return (
        <article
            style={{
                padding: "24px 0",
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2 mb-2.5 text-sm">
                        <Link
                            as={`/@${article.authorUsername}`} href={`/profile/${article.authorUsername}`}
                            className="flex items-center gap-2"
                        >
                            <Avatar
                                initials={article.authorInitials}
                                img={article.authorImage}
                                size={24}
                                bg="var(--color-accent)"
                            />
                            <span className="font-medium hover:underline">
                                {article.author}
                            </span>
                        </Link>
                        <span className="font-bold">·</span>
                        <span className="text-(--color-light)">
                            {article.date}
                        </span>
                    </div>

                    <Link href={`/article/${article.slug}`}>
                        <h2 className="article-title font-semibold leading-normal mb-1.5 cursor-pointer">
                            {article.title}
                        </h2>
                    </Link>

                    <p
                        className="leading-relaxed text-sm text-(--color-light) overflow-hidden line-clamp-2"
                        style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {article.excerpt}
                    </p>
                </div>

                {article.image && (
                    <img
                        src={article.image}
                        alt={article.excerpt}
                        className="article-thumb shrink-0 rounded-sm"
                    />
                )}
            </div>

            <div className="flex justify-between gap-2.5 mt-3">
                <div className="flex items-center gap-2.5">
                    <span className="text-xs whitespace-nowrap shrink-0">
                        {article.topic}
                    </span>
                    <span className="text-(--color-light) text-sm font-bold">
                        ·
                    </span>
                    <span className="text-xs whitespace-nowrap shrink-0">
                        {article.readTime} دقائق
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <RequireAuth onClick={toggleSave} mode="login">
                        <button
                            className={`cursor-pointer pl-1 ${
                                saved
                                    ? "text-accent"
                                    : "text-mid hover:text-ink"
                            }`}
                            style={{ transition: "color 0.15s" }}
                        >
                            <Bookmark
                                size={19}
                                fill={saved ? "var(--color-accent)" : "none"}
                                color="currentColor"
                            />
                        </button>
                    </RequireAuth>

                    <ArticleMoreMenu article={article} isOwner={isOwner}>
                        <Ellipsis size={19} style={{ marginLeft: 4 }} />
                    </ArticleMoreMenu>
                </div>
            </div>
        </article>
    );
};

export default ArticleCard;
