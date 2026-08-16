"use client";
import { useState, useContext } from "react";
import Tabs from "@/components/ui/Tabs";
import AppLayout from "@/components/AppLayout";
import { ARTICLES } from "@/data/dummybData";
import ArticleCard from "@/components/ArticleCard";
import { WidthContext } from "@/context/ScreenContext";

const TABS = [
    { id: "articles", label: "المقالات المحفوظة" },
    { id: "lists", label: "القوائم المحفوظة" },
    { id: "history", label: "سجل القراءة" },
    { id: "highlights", label: "الإقتباسات" },
];

export default function Library() {
    const [activeTab, setActiveTab] = useState("articles");
    const [loading, setLoading] = useState(false);

    const width = useContext(WidthContext);
    const isMobile = width < 768;

    return (
        <AppLayout>
            <Tabs
                active={activeTab}
                setActive={setActiveTab}
                tabList={TABS}
                loading={loading}
                loadingMessage="جاري التحميل..."
            />

            {ARTICLES.map((article) => {
                return (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        isMobile={isMobile}
                    />
                );
            })}
        </AppLayout>
    );
}
