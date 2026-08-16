"use client";

import { useState, useContext, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import { MoreHorizontal, Copy, Globe, Link2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import AppLayout from "@/components/AppLayout";
import ArticleCard from "@/components/ArticleCard";
import { WidthContext } from "@/context/ScreenContext";
import ListCard from "@/components/ListCard";
import RequireAuth from "@/components/RequireAuth";
import { useArticleList } from "@/hooks/useArticleList";
import { useUserLists } from "@/hooks/useUserLists";
import { useUser } from "@/hooks/useUser";
import { parseList } from "@/lib/api/feed";

const PROFILE_TABS = [
    { id: "home", label: "المقالات" },
    { id: "lists", label: "القوائم" },
    { id: "about", label: "حول" },
];

const formatCount = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + " ألف";
    return String(n);
};

const AboutTab = ({ profile }) => (
    <div style={{ padding: "24px 0" }}>
        <h3
            style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--color-ink)",
                marginBottom: 12,
            }}
        >
            {profile.name}
        </h3>
        <p
            style={{
                fontSize: 15,
                color: "var(--color-light)",
                lineHeight: 1.8,
                marginBottom: 20,
            }}
        >
            {profile.bio}
        </p>
        <div
            style={{
                display: "flex",
                gap: 24,
                fontSize: 14,
                color: "var(--color-ink)",
            }}
        >
            <span>
                <strong>{formatCount(profile.followersCount)}</strong>{" "}
                <span style={{ color: "var(--color-light)" }}>متابع</span>
            </span>
            <span>
                <strong>{formatCount(profile.followingCount)}</strong>{" "}
                <span style={{ color: "var(--color-light)" }}>يتابع</span>
            </span>
        </div>
    </div>
);

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
};

const ProfilePanel = ({ profile, following, onToggleFollow }) => (
    <div
        className="card"
        style={{
            width: "100%",
            padding: 28,
        }}
    >
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Avatar
                img={profile.avatarUrl}
                initials={getInitials(profile.name)}
                size={80}
            />
        </div>

        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginTop: 16,
            }}
        >
            <h1
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "var(--color-ink)",
                    margin: 0,
                }}
            >
                {profile.name}
            </h1>
        </div>

        <p
            style={{
                textAlign: "center",
                direction: "ltr",
                color: "var(--color-mid)",
                fontSize: 14,
                marginTop: 4,
            }}
        >
            @{profile.username}
        </p>

        <p
            style={{
                textAlign: "center",
                color: "var(--color-light)",
                fontSize: 14,
                lineHeight: 1.7,
                marginTop: 12,
                padding: "0 4px",
            }}
        >
            {profile.bio}
        </p>

        <div
            dir="ltr"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 20,
            }}
        >
            <button
                aria-label="Copy"
                className="text-mid hover:bg-bg"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                }}
            >
                <Copy size={16} strokeWidth={2} />
            </button>
            <button
                aria-label="website"
                className="text-mid hover:bg-bg"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                }}
            >
                <Globe size={16} strokeWidth={2} />
            </button>
            <button
                aria-label="Link"
                className="text-mid hover:bg-bg"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                }}
            >
                <Link2
                    size={16}
                    strokeWidth={2}
                    style={{ transform: "rotate(-45deg)" }}
                />
            </button>
        </div>

        <div
            dir="ltr"
            style={{
                display: "flex",
                alignItems: "stretch",
                justifyContent: "center",
                marginTop: 20,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "0 20px",
                }}
            >
                <span
                    style={{
                        fontSize: 16,
                        color: "var(--color-ink)",
                    }}
                >
                    {formatCount(profile.followingCount)}
                </span>
                <span
                    dir="rtl"
                    style={{
                        fontSize: 12,
                        color: "var(--color-mid)",
                        marginTop: 2,
                    }}
                >
                    يتابع
                </span>
            </div>
            <div
                style={{
                    width: 1,
                    background: "var(--color-border)",
                }}
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "0 20px",
                }}
            >
                <span
                    style={{
                        fontSize: 16,
                        color: "var(--color-ink)",
                    }}
                >
                    {formatCount(profile.followersCount)}
                </span>
                <span
                    dir="rtl"
                    style={{
                        fontSize: 12,
                        color: "var(--color-mid)",
                        marginTop: 2,
                    }}
                >
                    متابع
                </span>
            </div>
            <div
                style={{
                    width: 1,
                    background: "var(--color-border)",
                }}
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "0 20px",
                }}
            >
                <span
                    style={{
                        fontSize: 16,
                        color: "var(--color-ink)",
                    }}
                >
                    {profile.articlesCount}
                </span>
                <span
                    dir="rtl"
                    style={{
                        fontSize: 12,
                        color: "var(--color-mid)",
                        marginTop: 2,
                    }}
                >
                    مقالات
                </span>
            </div>
        </div>

        <div style={{ marginTop: 20 }}>
            <RequireAuth onClick={onToggleFollow} mode="login">
                <Button
                    variant={following ? "secondary" : "primary"}
                    style={{
                        width: "100%",
                    }}
                >
                    {following ? "إلغاء المتابعة" : "متابعة"}
                </Button>
            </RequireAuth>
        </div>
    </div>
);

export default function ProfilePage() {
    const params = useParams();
    const username = params?.username;
    const [tab, setTab] = useState("home");
    const [following, setFollowing] = useState(false);
    const width = useContext(WidthContext);
    const isMobile = width < 768;

    const { profile, isLoading, error } = useUser(username);

    // Articles tab is focused first; lists are prefetched right after.
    const articles = useArticleList(
        { sort: "new", author: profile?.id },
        { enabled: Boolean(profile) },
    );
    const lists = useUserLists(profile?.id, { enabled: Boolean(profile) });

    useEffect(() => {
        setTab("home");
    }, [username]);

    if (error) notFound();

    if (isLoading || !profile) return null;

    return (
        <AppLayout
            leftPanel={
                <ProfilePanel
                    profile={profile}
                    following={following}
                    onToggleFollow={() => setFollowing((f) => !f)}
                />
            }
            centerMaxWidth={700}
            fullWidthContent={
                profile.bannerUrl && (
                    <div
                        style={{
                            width: "1000px",
                            maxWidth: "100%",
                            margin: "0 auto",
                            height: isMobile ? 130 : 200,
                            overflow: "hidden",
                            background: "var(--color-surface-subtle)",
                        }}
                    >
                        {profile.bannerUrl && (
                            <img
                                src={profile.bannerUrl}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        )}
                    </div>
                )
            }
        >
            {isMobile && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginTop: 16,
                        marginBottom: 4,
                    }}
                >
                    <Avatar
                        img={profile.avatarUrl}
                        initials={getInitials(profile.name)}
                        size={52}
                        bg="var(--color-accent)"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                            style={{
                                fontSize: 17,
                                fontWeight: 700,
                                color: "var(--color-ink)",
                                lineHeight: 1.2,
                            }}
                        >
                            {profile.name}
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "var(--color-light)",
                            }}
                        >
                            {formatCount(profile.followersCount)} متابع
                        </div>
                    </div>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--color-light)",
                            display: "flex",
                            padding: 4,
                        }}
                    >
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            )}

            {isMobile && (
                <div style={{ margin: "20px 0" }}>
                    <RequireAuth>
                        <Button
                            onClick={() => setFollowing((f) => !f)}
                            variant={following ? "secondary" : "primary"}
                            style={{
                                width: "100%",
                            }}
                        >
                            {following ? "إلغاء المتابعة" : "متابعة"}
                        </Button>
                    </RequireAuth>
                </div>
            )}

            {!isMobile && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginTop: 40,
                        marginBottom: 40,
                    }}
                >
                    <h1
                        style={{
                            fontSize: 32,
                            fontWeight: 700,
                            color: "var(--color-ink)",
                            margin: 0,
                            lineHeight: 1.15,
                        }}
                    >
                        {profile.name}
                    </h1>
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--color-light)",
                            display: "flex",
                            padding: 4,
                            marginTop: 6,
                        }}
                    >
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            )}

            <Tabs
                active={tab}
                setActive={setTab}
                tabList={PROFILE_TABS}
                loading={
                    tab === "about"
                        ? false
                        : tab === "lists"
                          ? lists.loading
                          : articles.loading
                }
                loadingMessage="جاري التحميل..."
            />

            {tab === "about" ? (
                <AboutTab profile={profile} />
            ) : tab === "lists" ? (
                <div>
                    {lists.loading ? null : (
                        <>
                            {lists.items.map((l) => (
                                <ListCard
                                    key={l.id}
                                    list={parseList(l, profile?.name)}
                                    isMobile={isMobile}
                                />
                            ))}
                            {lists.hasMore && (
                                <div style={{ padding: "16px 0" }}>
                                    <Button
                                        onClick={lists.loadMore}
                                        loading={lists.loadingMore}
                                        variant="secondary"
                                        style={{ width: "100%" }}
                                    >
                                        عرض المزيد
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : articles.loading ? null : articles.items.length ? (
                <>
                    {articles.items.map((a) => (
                        <ArticleCard
                            key={a.id}
                            article={a}
                            isMobile={isMobile}
                        />
                    ))}
                    {articles.hasMore && (
                        <div style={{ padding: "16px 0" }}>
                            <Button
                                onClick={articles.loadMore}
                                loading={articles.loadingMore}
                                variant="secondary"
                                style={{ width: "100%" }}
                            >
                                عرض المزيد
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div
                    style={{
                        padding: "24px 0",
                        color: "var(--color-mid)",
                        textAlign: "center",
                    }}
                >
                    لا توجد مقالات بعد
                </div>
            )}
        </AppLayout>
    );
}
