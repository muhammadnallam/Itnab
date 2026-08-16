"use client";
import AppLayout from "@/components/AppLayout";
import ArticleCard from "@/components/ArticleCard";
import AvatarSlider from "@/components/AvatarSlider";
import { ARTICLES, WRITERS } from "@/data/dummybData";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";

export default function SubscriptionsPage() {
    const isMobile = useIsBreakpoint("max", 768);

    return (
        <AppLayout>
            <AvatarSlider writers={WRITERS} />
            <div
                style={{
                    marginTop: 32,
                    marginBottom: 16,
                    borderBottom: "1px solid var(--color-border)",
                }}
            />
            <div style={{ marginTop: 8 }}>
                {ARTICLES.map((article) => {
                    return (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            isMobile={isMobile}
                        />
                    );
                })}
            </div>
        </AppLayout>
    );
}
