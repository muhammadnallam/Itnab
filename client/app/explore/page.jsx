"use client";
import AppLayout from "@/components/AppLayout";
import { Compass, Search } from "lucide-react";
import { TAGS } from "@itnab/constants";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Slider from "@/components/ui/Slider";
import { ARTICLES } from "@/data/dummyData";
import ArticleCard from "@/components/ArticleCard";

import { WidthContext } from "@/context/ScreenContext";

import { useState, useContext } from "react";
import ArticleCardVertical from "@/components/ArticleCardVertical";

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
};

const TopicsScroller = ({ topics = TAGS, onSelectTopic, style }) => {
    const [activeTopic, setActiveTopic] = useState(null); // null = "all topics"

    const handleSelect = (topic) => {
        setActiveTopic((current) => (current === topic ? null : topic));
        onSelectTopic?.(topic);
    };

    return (
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
                    onClick={() => handleSelect(null)}
                    className="itn-explore-pill"
                >
                    <Compass size={16} />
                    <span>الكل</span>
                </button>

                {topics.map((topic) => (
                    <button
                        key={topic}
                        type="button"
                        onClick={() => handleSelect(topic)}
                        className={`itn-topic-pill${activeTopic === topic ? " is-active" : ""}`}
                    >
                        {topic}
                    </button>
                ))}
            </Slider>
        </div>
    );
};

const SuggestionsPanel = ({
    suggestions,
    followingIds = [],
    mutatingId,
    onToggleFollow,
}) => {
    if (!suggestions?.length) return null;

    return (
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
                    {suggestions.map((item) => {
                        const isFollowing = followingIds.includes(item.id);
                        return (
                            <div
                                key={item.id}
                                className="card"
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
                                    img={item.avatarUrl}
                                    initials={getInitials(item.name)}
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
                                    {item.name}
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
                                    {item.username}
                                </span>

                                <div style={{ width: "100%", marginTop: 16 }}>
                                    <Button
                                        variant={
                                            isFollowing
                                                ? "secondary"
                                                : "primary"
                                        }
                                        loading={mutatingId === item.id}
                                        onClick={() => onToggleFollow?.(item)}
                                        style={{ width: "100%" }}
                                    >
                                        {isFollowing ? "Following" : "Follow"}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </Slider>
            </div>
        </div>
    );
};

export default function ExplorePage() {
    const width = useContext(WidthContext);
    const isMobile = width < 768;

    return (
        <AppLayout centerMaxWidth={740}>
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
                    with: "100%",
                }}
            >
                <Search size={18} />
                <input
                    placeholder="بحث"
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
            <TopicsScroller style={{ marginTop: 16 }} />

            <div
                style={{
                    margin: "32px 0",
                    borderBottom: "1px solid var(--color-border)",
                }}
            ></div>

            <h4 className="font-bold text-xl mb-4 mt-4">
                أفضل مقالات هذا الشهر
            </h4>
            {ARTICLES.slice(0, 3).map((article) => {
                return (
                    <ArticleCard
                        key={article.id}
                        article={article}
                        isMobile={isMobile}
                    />
                );
            })}

            {/* <div
                style={{
                    margin: "32px 0",
                    borderBottom: "1px solid var(--color-border)",
                }}
            ></div> */}

            <SuggestionsPanel
                suggestions={[
                    { id: 1, username: "john_doe", displayName: "John Doe" },
                    {
                        id: 2,
                        username: "jane_smith",
                        displayName: "Jane Smith",
                    },
                    {
                        id: 3,
                        username: "bob_johnson",
                        displayName: "Bob Johnson",
                    },
                    { id: 4, username: "john_doe", displayName: "John Doe" },
                    {
                        id: 5,
                        username: "jane_smith",
                        displayName: "Jane Smith",
                    },
                    {
                        id: 6,
                        username: "bob_johnson",
                        displayName: "Bob Johnson",
                    },
                ]}
            />

            <div
                style={{
                    margin: "32px 0",
                    borderBottom: "1px solid var(--color-border)",
                }}
            ></div>

            <h4 className="font-bold text-xl mb-4 mt-4">مقالات للقراءة</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ARTICLES.slice(0, 6).map((article) => {
                    return (
                        <ArticleCardVertical
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
