"use client";

import { Suspense, useState, useMemo, useCallback, useContext, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { Compass, Search } from "lucide-react";
import { TAGS } from "@itnab/constants";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import Tabs from "@/components/ui/Tabs";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardVertical from "@/components/ArticleCardVertical";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import ArticleCardVerticalSkeleton from "@/components/ArticleCardVerticalSkeleton";
import { WidthContext } from "@/context/ScreenContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useExploreRecommendations } from "@/hooks/useExploreRecommendations";
import { useSearch } from "@/hooks/useSearch";
import { useTagFeed } from "@/hooks/useTagFeed";

const MONTH_NAMES = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function getMonthName() {
    const month = new Date().getMonth();
    return MONTH_NAMES[month];
}

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
};

const TopicsScroller = ({ activeTag, onSelect, style }) => (
    <div dir="rtl" style={{ width: "100%", ...style }}>
        <style>{`
        .itn-topic-pill {
            flex-shrink: 0;
            white-space: nowrap;
            border-radius: var(--border-radius);
            padding: 6px 16px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            border: 1px solid var(--color-border);
            background: var(--color-white);
            color: var(--color-ink);
            transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .itn-topic-pill:hover {
            background: var(--color-surface);
            border-color: var(--color-mid);
        }
        .itn-topic-pill.is-active {
            background: var(--color-accent);
            border-color: var(--color-accent);
            color: var(--color-white);
        }
        .itn-topic-pill.is-active:hover {
            background: var(--color-accent);
            border-color: var(--color-accent);
        }
        .itn-explore-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            flex-shrink: 0;
            white-space: nowrap;
            border-radius: 99px;
            padding: 6px 16px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            border: 1px solid var(--color-accent);
            background: transparent;
            color: var(--color-accent);
            transition: background 0.15s;
        }
        .itn-explore-pill:hover {
            background: var(--color-accent-light);
        }
        `}</style>

        <Slider gap={8} trackStyle={{ padding: "4px 1px" }}>
            <button
                type="button"
                onClick={() => onSelect(null)}
                className="itn-explore-pill"
            >
                <Compass size={16} />
                <span>الكل</span>
            </button>
            {TAGS.map((topic) => (
                <button
                    key={topic}
                    type="button"
                    onClick={() => onSelect(topic)}
                    className={`itn-topic-pill${activeTag === topic ? " is-active" : ""}`}
                >
                    {topic}
                </button>
            ))}
        </Slider>
    </div>
);

const AuthorCard = ({ author }) => (
    <div
        style={{
            position: "relative",
            flex: "0 0 auto",
            width: 200,
            padding: "20px 16px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}
    >
        <Avatar
            img={author.image}
            initials={getInitials(author.name)}
            size={64}
        />
        <span
            style={{
                marginTop: 12,
                fontSize: 14,
                fontWeight: 700,
                color: "var(--color-ink)",
                textAlign: "center",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}
        >
            {author.name}
        </span>
        <span
            style={{
                marginTop: 2,
                fontSize: 13,
                color: "var(--color-mid)",
                textAlign: "center",
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}
        >
            @{author.username}
        </span>
    </div>
);

function RecommendationsView({ isMobile }) {
    const rec = useExploreRecommendations();

    if (rec.loading) {
        return (
            <>
                <h4 className="font-bold text-xl mb-4 mt-4">
                    أفضل مقالات شهر {getMonthName()}
                </h4>
                {[1, 2, 3].map((i) => (
                    <ArticleCardSkeleton key={i} isMobile={isMobile} />
                ))}

                <div style={{ marginTop: 32 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: "var(--color-ink)",
                                margin: 0,
                            }}
                        >
                            كتّاب مقترحة
                        </h2>
                    </div>
                    <div style={{ position: "relative", marginTop: 16 }}>
                        <Slider gap={12}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex: "0 0 auto",
                                        width: 200,
                                        padding: "20px 16px 16px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: "50%",
                                            background: "var(--color-tag-bg)",
                                            animation: "pulse 1.5s ease-in-out infinite",
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 80,
                                            height: 14,
                                            borderRadius: 4,
                                            background: "var(--color-tag-bg)",
                                            marginTop: 12,
                                            animation: "pulse 1.5s ease-in-out infinite",
                                        }}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <div
                    style={{
                        margin: "32px 0",
                        borderBottom: "1px solid var(--color-border)",
                    }}
                />

                <h4 className="font-bold text-xl mb-4 mt-4">مقالات للقراءة</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <ArticleCardVerticalSkeleton key={i} />
                    ))}
                </div>
            </>
        );
    }

    return (
        <>
            <h4 className="font-bold text-xl mb-4 mt-4">
                أفضل مقالات شهر {getMonthName()}
            </h4>
            {rec.bestThisMonth.length === 0 ? (
                <p
                    style={{
                        color: "var(--color-mid)",
                        fontSize: 14,
                        textAlign: "center",
                        marginTop: 40,
                    }}
                >
                    لا توجد مقالات هذا الشهر
                </p>
            ) : (
                rec.bestThisMonth.map((article) => (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        isMobile={isMobile}
                    />
                ))
            )}

            {rec.randomAuthors.length > 0 && (
                <div style={{ marginTop: 32 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: "var(--color-ink)",
                                margin: 0,
                            }}
                        >
                            كتّاب مقترحة
                        </h2>
                    </div>
                    <div style={{ position: "relative", marginTop: 16 }}>
                        <Slider gap={12}>
                            {rec.randomAuthors.map((author) => (
                                <AuthorCard key={author.id} author={author} />
                            ))}
                        </Slider>
                    </div>
                </div>
            )}

            <div
                style={{
                    margin: "32px 0",
                    borderBottom: "1px solid var(--color-border)",
                }}
            />

            <h4 className="font-bold text-xl mb-4 mt-4">مقالات للقراءة</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                {rec.randomArticles.map((article) => (
                    <ArticleCardVertical
                        key={article.id}
                        article={article}
                        isMobile={isMobile}
                    />
                ))}
            </div>
        </>
    );
}

function TagFeedView({ tag, isMobile }) {
    const feed = useTagFeed(tag);

    if (feed.loading) {
        return (
            <>
                {[1, 2, 3, 4, 5].map((i) => (
                    <ArticleCardSkeleton key={i} isMobile={isMobile} />
                ))}
            </>
        );
    }

    return (
        <>
            {feed.items.map((article) => (
                <ArticleCard
                    key={article.id}
                    article={article}
                    isMobile={isMobile}
                />
            ))}
            {feed.items.length === 0 && (
                <p
                    style={{
                        color: "var(--color-mid)",
                        fontSize: 14,
                        textAlign: "center",
                        marginTop: 40,
                    }}
                >
                    لا توجد مقالات في هذا التصنيف
                </p>
            )}
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
    );
}

function SearchView({ query, isDebouncing, activeTab, onTabChange, isMobile }) {
    const search = useSearch(query);

    const tabList = [
        { id: "articles", label: "المقالات" },
        { id: "authors", label: "الكتّاب" },
    ];

    const loading = isDebouncing || search.loading || search.isFetching;

    return (
        <>
            <Tabs
                active={activeTab}
                setActive={onTabChange}
                tabList={tabList}
                loading={loading}
                loadingMessage="جاري البحث..."
            />
            {!loading && (
                <>
                    {activeTab === "articles" && (
                        <>
                            {search.articles.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    article={article}
                                    isMobile={isMobile}
                                />
                            ))}
                            {search.articles.length === 0 && query.trim().length >= 2 && (
                                <p
                                    style={{
                                        color: "var(--color-mid)",
                                        fontSize: 14,
                                        textAlign: "center",
                                        marginTop: 40,
                                    }}
                                >
                                    لا توجد نتائج لـ &ldquo;{query}&rdquo;
                                </p>
                            )}
                        </>
                    )}
                    {activeTab === "authors" && (
                        <>
                            {search.authors.map((author) => (
                                <a
                                    key={author.id}
                                    href={`/@${author.username}`}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                        padding: "16px 0",
                                        borderBottom:
                                            "1px solid var(--color-border)",
                                        textDecoration: "none",
                                        color: "var(--color-ink)",
                                    }}
                                >
                                    <Avatar
                                        img={author.image}
                                        initials={getInitials(author.name)}
                                        size={48}
                                        bg="var(--color-accent)"
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {author.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: "var(--color-mid)",
                                            }}
                                        >
                                            @{author.username}
                                        </div>
                                    </div>
                                </a>
                            ))}
                            {search.authors.length === 0 && query.trim().length >= 2 && (
                                <p
                                    style={{
                                        color: "var(--color-mid)",
                                        fontSize: 14,
                                        textAlign: "center",
                                        marginTop: 40,
                                    }}
                                >
                                    لا توجد نتائج لـ &ldquo;{query}&rdquo;
                                </p>
                            )}
                        </>
                    )}
                </>
            )}
        </>
    );
}

function ExploreContent() {
    const width = useContext(WidthContext);
    const isMobile = width < 768;
    const sp = useSearchParams();
    const router = useRouter();

    const urlQ = sp.get("q") ?? "";
    const urlTag = sp.get("tag") ?? null;

    const [rawQ, setRawQ] = useState(urlQ);
    const debouncedQ = useDebounce(rawQ, 350);

    // Sync rawQ from URL when navigating via back/forward or direct link
    useEffect(() => {
        setRawQ(urlQ); // eslint-disable-line react-hooks/set-state-in-effect
    }, [urlQ]);

    const mode = useMemo(() => {
        if (debouncedQ.trim()) return "search";
        if (urlTag) return "tag";
        return "recommendation";
    }, [debouncedQ, urlTag]);

    const updateURL = useCallback(
        (updates) => {
            const params = new URLSearchParams(sp.toString());
            Object.entries(updates).forEach(([k, v]) => {
                if (v === null || v === undefined || v === "") {
                    params.delete(k);
                } else {
                    params.set(k, v);
                }
            });
            router.replace(`/explore?${params.toString()}`, { scroll: false });
        },
        [router, sp],
    );

    const handleSearchChange = (value) => {
        setRawQ(value);
        if (value.trim()) {
            updateURL({ q: value.trim(), tab: "articles", tag: null });
        } else {
            updateURL({ q: null });
        }
    };

    const handleTagSelect = (tag) => {
        if (tag === null) {
            updateURL({ tag: null, q: null });
            setRawQ("");
        } else {
            updateURL({ tag, q: null });
            setRawQ("");
        }
    };

    const handleSearchTabChange = (tab) => {
        updateURL({ tab });
    };

    return (
        <AppLayout>
            <div
                style={{
                    position: "sticky",
                    top: 57,
                    zIndex: 5,
                    background: "var(--color-bg)",
                    paddingTop: 16,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "var(--color-white)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--border-radius)",
                        padding: "8px 16px",
                        flex: 1,
                        width: "100%",
                    }}
                >
                    <Search size={18} />
                    <input
                        placeholder="بحث"
                        value={rawQ}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        style={{
                            background: "none",
                            border: "none",
                            outline: "none",
                            fontSize: 14,
                            color: "var(--color-ink)",
                            width: "100%",
                            direction: "rtl",
                        }}
                    />
                </div>
                <TopicsScroller
                    activeTag={urlTag}
                    onSelect={handleTagSelect}
                    style={{ marginTop: 16 }}
                />
                <div
                    style={{
                        margin: "16px 0",
                        borderBottom: "1px solid var(--color-border)",
                    }}
                />
            </div>

            {mode === "recommendation" && (
                <RecommendationsView isMobile={isMobile} />
            )}
            {mode === "tag" && (
                <TagFeedView tag={urlTag} isMobile={isMobile} />
            )}
            {mode === "search" && (
                <SearchView
                    query={debouncedQ}
                    isDebouncing={rawQ !== debouncedQ}
                    activeTab={sp.get("tab") ?? "articles"}
                    onTabChange={handleSearchTabChange}
                    isMobile={isMobile}
                />
            )}
        </AppLayout>
    );
}

export default function ExplorePage() {
    return (
        <Suspense
            fallback={
                <AppLayout>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 80,
                        }}
                    >
                        <span
                            style={{ color: "var(--color-mid)", fontSize: 14 }}
                        >
                            جاري التحميل...
                        </span>
                    </div>
                </AppLayout>
            }
        >
            <ExploreContent />
        </Suspense>
    );
}
