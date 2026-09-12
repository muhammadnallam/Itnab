"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import Avatar from "@/components/ui/Avatar";
import RequireAuth from "@/components/RequireAuth";
import {
    Bookmark,
    Ellipsis,
} from "lucide-react";
import { queryKeys } from "@/lib/query-keys";
import { saveArticle, unsaveArticle } from "@/lib/api/interactions";
import { toast } from "sonner";

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

const ArticleCardVertical = ({ article, isMobile }) => {
    const id = article?.id;
    const saved = article?.saved ?? false;
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationFn: (save) => (save ? saveArticle(id) : unsaveArticle(id)),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: queryKeys.allArticles() });
            const previous = qc.getQueriesData({
                queryKey: queryKeys.allArticles(),
            });
            qc.setQueriesData({ queryKey: queryKeys.allArticles() }, (data) =>
                mapArticles(data, (a) =>
                    a.id === id ? { ...a, saved: !saved } : a,
                ),
            );
            return { previous };
        },
        onSuccess: (_data, save) => {
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
                display: "flex",
                flexDirection: "column",
            }}
        >
            {article.image && (
                <a href={`/article/${article.slug}`}>
                    <img
                        src={article.image}
                        alt={article.excerpt}
                        className="w-full rounded-sm"
                        style={{
                            aspectRatio: "16 / 11",
                            objectFit: "cover",
                            marginBottom: 14,
                        }}
                    />
                </a>
            )}

            <Link
                href={`/@${article.authorUsername}`}
                className="flex items-center gap-2 mb-2.5 text-sm"
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

            <a href={`/article/${article.slug}`}>
                <h2
                    className="font-semibold leading-normal mb-1.5 cursor-pointer overflow-hidden line-clamp-2 text-sm"
                    style={{
                        // fontSize: isMobile ? 17 : 20,
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {article.title}
                </h2>
            </a>

            <p
                className="leading-relaxed text-xs text-(--color-light) overflow-hidden line-clamp-2 mb-3"
                style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                }}
            >
                {article.excerpt}
            </p>
        </article>
    );
};

export default ArticleCardVertical;
