"use client";

import { useState, useContext, use } from "react";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import AppLayout from "@/components/AppLayout";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import Avatar from "@/components/ui/Avatar";
import { getList, parseArticle } from "@/lib/api/feed";
import { WidthContext } from "@/context/ScreenContext";

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
};

export default function ListPage({ params }) {
    const { id } = use(params);
    const width = useContext(WidthContext);
    const isMobile = width < 768;

    const { data: list, isLoading, error } = useQuery({
        queryKey: ["list", id],
        queryFn: () => getList(id),
        enabled: !!id,
    });

    if (error) {
        if (error.status === 404) return notFound();
        return (
            <AppLayout>
                <p style={{ textAlign: "center", padding: 40, color: "var(--color-light)" }}>
                    حدث خطأ أثناء تحميل القائمة
                </p>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            {isLoading ? (
                <div>
                    {[1, 2, 3].map((i) => (
                        <ArticleCardSkeleton key={i} isMobile={isMobile} />
                    ))}
                </div>
            ) : list ? (
                <div>
                    {/* List header */}
                    <div style={{ marginBottom: 24 }}>
                        <h1
                            style={{
                                fontFamily: "Georgia, 'Noto Serif Arabic', serif",
                                fontSize: isMobile ? 22 : 28,
                                fontWeight: 700,
                                color: "var(--color-ink)",
                                lineHeight: 1.3,
                                margin: "0 0 12px",
                            }}
                        >
                            {list.name}
                        </h1>

                        <a
                            href={`/@${list.author?.username}`}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                textDecoration: "none",
                            }}
                        >
                            <Avatar
                                img={list.author?.image}
                                initials={getInitials(list.author?.name)}
                                size={24}
                                bg="var(--color-accent)"
                            />
                            <span
                                style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: "var(--color-ink)",
                                }}
                                className="hover:underline"
                            >
                                {list.author?.name}
                            </span>
                        </a>

                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--color-light)",
                                marginTop: 8,
                            }}
                        >
                            {list._count?.savedArticles ?? 0} مقالة
                        </p>
                    </div>

                    {/* Articles */}
                    {list.articles?.length > 0 ? (
                        list.articles.map((a) => (
                            <ArticleCard
                                key={a.id}
                                article={parseArticle(a)}
                                isMobile={isMobile}
                            />
                        ))
                    ) : (
                        <p
                            style={{
                                textAlign: "center",
                                padding: 40,
                                color: "var(--color-light)",
                            }}
                        >
                            لا توجد مقالات في هذه القائمة
                        </p>
                    )}
                </div>
            ) : null}
        </AppLayout>
    );
}
