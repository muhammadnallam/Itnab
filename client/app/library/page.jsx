"use client";
import { useState, useContext } from "react";
import Tabs from "@/components/ui/Tabs";
import AppLayout from "@/components/AppLayout";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import ListCard from "@/components/ListCard";
import Button from "@/components/ui/Button";
import { WidthContext } from "@/context/ScreenContext";
import { UserContext } from "@/context/UserContext";
import { useUserSaves } from "@/hooks/useUserSaves";
import { useUserViews } from "@/hooks/useUserViews";
import { useUserSavedLists } from "@/hooks/useUserSavedLists";

const TABS = [
    { id: "articles", label: "المقالات المحفوظة" },
    { id: "lists", label: "القوائم المحفوظة" },
    { id: "history", label: "سجل القراءة" },
];

const EMPTY_MESSAGES = {
    articles: "لا توجد مقالات محفوظة",
    lists: "لا توجد قوائم محفوظة",
    history: "لا يوجد سجل قراءة",
};

export default function Library() {
    const [activeTab, setActiveTab] = useState("articles");
    const { user } = useContext(UserContext);
    const width = useContext(WidthContext);
    const isMobile = width < 768;

    const saves = useUserSaves(user?.id);
    const views = useUserViews(user?.id);
    const savedLists = useUserSavedLists(user?.id);

    const feed =
        activeTab === "articles"
            ? saves
            : activeTab === "history"
              ? views
              : activeTab === "lists"
                ? savedLists
                : null;

    const isFunctionalTab =
        activeTab === "articles" ||
        activeTab === "history" ||
        activeTab === "lists";

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
            ) : (
                isFunctionalTab &&
                !feed?.loading && (
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
                                {activeTab === "lists"
                                    ? feed.items.map((list) => (
                                          <ListCard
                                              key={list.id}
                                              list={list}
                                              isMobile={isMobile}
                                              isOwner={false}
                                          />
                                      ))
                                    : feed.items.map((article) => (
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
                )
            )}
        </AppLayout>
    );
}
