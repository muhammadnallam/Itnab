"use client";
import Link from "next/link";
import { useContext } from "react";
import AppLayout from "@/components/AppLayout";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import Avatar from "@/components/ui/Avatar";
import Slider from "@/components/ui/Slider";
import Button from "@/components/ui/Button";
import { UserContext } from "@/context/UserContext";
import { useFollowing } from "@/hooks/useFollowing";
import { useSubscriptionFeed } from "@/hooks/useSubscriptionFeed";
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
                        key={writer.id}
                        href={`/profile/${writer.username}`}
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
                                src={writer.image}
                                initials={writer.name?.[0]}
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
    const { user } = useContext(UserContext);
    const following = useFollowing(user?.id, { enabled: !!user });
    const feed = useSubscriptionFeed({ enabled: !!user });

    const hasFollows = !following.loading && following.writers.length > 0;

    return (
        <AppLayout>
            {hasFollows && <WritersSlider writers={following.writers} />}
            {hasFollows && (
                <div
                    style={{
                        marginTop: 32,
                        marginBottom: 16,
                        borderBottom: "1px solid var(--color-border)",
                    }}
                />
            )}

            {feed.loading ? (
                <div style={{ marginTop: hasFollows ? 8 : 0 }}>
                    {[1, 2, 3].map((i) => (
                        <ArticleCardSkeleton key={i} isMobile={isMobile} />
                    ))}
                </div>
            ) : !hasFollows ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "48px 0",
                        color: "var(--color-mid)",
                    }}
                >
                    تابع كتّاباً لبناء خلاصتك الخاصة
                    <div style={{ marginTop: 12 }}>
                        <Link
                            href="/explore"
                            className="text-accent hover:underline"
                        >
                            استكشاف الكتّاب
                        </Link>
                    </div>
                </div>
            ) : feed.items.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "48px 0",
                        color: "var(--color-mid)",
                    }}
                >
                    لا توجد مقالات بعد من اشتراكاتك
                </div>
            ) : (
                <div style={{ marginTop: 8 }}>
                    {feed.items.map((a) => (
                        <ArticleCard
                            key={a.id}
                            article={a}
                            isMobile={isMobile}
                        />
                    ))}
                    {feed.hasMore && (
                        <div className="py-4">
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
                </div>
            )}
        </AppLayout>
    );
}
