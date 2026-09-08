"use client";
import { useState, useContext } from "react";
import Tabs from "@/components/ui/Tabs";
import AppLayout from "@/components/AppLayout";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import Button from "@/components/ui/Button";
import { WidthContext } from "@/context/ScreenContext";
import { UserContext } from "@/context/UserContext";
import { useUserSaves } from "@/hooks/useUserSaves";
import { useUserViews } from "@/hooks/useUserViews";

const TABS = [
    { id: "articles", label: "المقالات المحفوظة" },
    { id: "lists", label: "القوائم المحفوظة" },
    { id: "history", label: "سجل القراءة" },
    { id: "highlights", label: "الإقتباسات" },
];

const EMPTY_MESSAGES = {
    articles: "لا توجد مقالات محفوظة",
    history: "لا يوجد سجل قراءة",
};

export default function Library() {
    const [activeTab, setActiveTab] = useState("articles");
    const { user } = useContext(UserContext);
    const width = useContext(WidthContext);
    const isMobile = width < 768;

    const saves = useUserSaves(user?.id);
    const views = useUserViews(user?.id);

    const feed =
        activeTab === "articles"
            ? saves
            : activeTab === "history"
              ? views
              : null;
    const isFunctionalTab = activeTab === "articles" || activeTab === "history";

    return (
        <AppLayout>
            <Tabs
                active={activeTab}
                setActive={setActiveTab}
                tabList={TABS}
                loading={false}
            />

            {isFunctionalTab && feed?.loading ? (
                <>
                    {[1, 2, 3].map((i) => (
                        <ArticleCardSkeleton key={i} />
                    ))}
                </>
            ) : isFunctionalTab && !feed?.loading && (
                <>
                    {feed.items.length === 0 ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: 80,
                            }}
                        >
                            <span
                                style={{
                                    color: "var(--color-mid)",
                                    fontSize: 14,
                                }}
                            >
                                {EMPTY_MESSAGES[activeTab]}
                            </span>
                        </div>
                    ) : (
                        <>
                            {feed.items.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    article={article}
                                    isMobile={isMobile}
                                />
                            ))}
                            {feed.hasMore && (
                                <div style={{ padding: "16px 0" }}>
                                    <Button
                                        onClick={feed.loadMore}
                                        loading={feed.loadingMore}
                                        variant="secondary"
                                        style={{ width: "100%" }}
                                    >
                                        عرض المزيد
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </AppLayout>
    );
}
