"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import Avatar from "@/components/ui/Avatar";
import RequireAuth from "@/components/RequireAuth";
import { Bookmark, Ellipsis } from "lucide-react";
import { queryKeys } from "@/lib/query-keys";
import { saveArticle, unsaveArticle } from "@/lib/api/interactions";
import { reportError } from "@/lib/notify";

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

const ArticleCard = ({ article, isMobile }) => {
    const id = article?.id;
    const saved = article?.saved ?? false;
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => (saved ? unsaveArticle(id) : saveArticle(id)),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: queryKeys.allArticles() });
            const previous = qc.getQueriesData({
                queryKey: queryKeys.allArticles(),
            });
            qc.setQueriesData(
                { queryKey: queryKeys.allArticles() },
                (data) =>
                    mapArticles(data, (a) =>
                        a.id === id ? { ...a, saved: !saved } : a,
                    ),
            );
            return { previous };
        },
        onError: (err, _vars, context) => {
            context.previous.forEach(([queryKey, data]) =>
                qc.setQueryData(queryKey, data),
            );
            reportError(err);
        },
    });

    const toggleSave = () => {
        if (!UUID_RE.test(id ?? "")) return;
        mutation.mutate();
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
                        <Avatar
                            initials={article.authorInitials}
                            img={article.authorAvatarUrl}
                            size={24}
                            bg="var(--color-accent)"
                        />
                        <span className="font-medium">{article.author}</span>
                        <span className="font-bold">·</span>
                        <span className="text-(--color-light)">
                            {article.date}
                        </span>
                    </div>

                    <a href={`/article/${article.slug}`}>
                        <h2
                            className="font-semibold leading-normal mb-1.5 cursor-pointer"
                            style={{ fontSize: isMobile ? 17 : 20 }}
                        >
                            {article.title}
                        </h2>
                    </a>

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
                        className="shrink-0 rounded-sm"
                        style={{
                            width: isMobile ? 88 : 120,
                            height: isMobile ? 88 : 120,
                            objectFit: "cover",
                        }}
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
                                saved ? "text-accent" : "text-mid hover:text-ink"
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

                    <button
                        className="cursor-pointer text-mid ml-1 hover:text-ink"
                        style={{
                            transition: "color 0.15s",
                        }}
                    >
                        <Ellipsis size={19} />
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ArticleCard;