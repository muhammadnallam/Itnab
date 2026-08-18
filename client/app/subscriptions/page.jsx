"use client";
import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import ArticleCard from "@/components/ArticleCard";
import Avatar from "@/components/ui/Avatar";
import Slider from "@/components/ui/Slider";
import { ARTICLES, WRITERS } from "@/data/dummyData";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";

const WritersSlider = ({
    writers = [],
    avatarSize = 65,
    title = "الإشتراكات",
}) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <span
                    style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: "var(--color-ink)",
                    }}
                >
                    {title}
                </span>
            </div>

            <Slider gap={0} trackStyle={{ paddingBottom: 2 }}>
                {writers.map((writer) => (
                    <Link
                        key={writer.username}
                        href={`/@${writer.username}`}
                        style={{ textDecoration: "none", flexShrink: 0 }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 8,
                                width: avatarSize + 16,
                            }}
                        >
                            <Avatar
                                initials={writer.avatar}
                                size={avatarSize}
                                bg="var(--color-accent)"
                            />
                            <span
                                style={{
                                    width: "100%",
                                    fontSize: 12.5,
                                    color: "var(--color-mid)",
                                    textAlign: "center",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {writer.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </Slider>
        </div>
    );
};

export default function SubscriptionsPage() {
    const isMobile = useIsBreakpoint("max", 768);

    return (
        <AppLayout>
            <WritersSlider writers={WRITERS} />
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
