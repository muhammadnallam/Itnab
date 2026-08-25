"use client";

import { useState, useContext, useEffect } from "react";
import { notFound, useParams } from "next/navigation";

import {
    MoreHorizontal,
    Copy,
    Globe,
    Link2,
    Pencil,
    Share2,
    Trash2,
    CircleAlert,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import Tabs from "@/components/ui/Tabs";
import ArticleCard from "@/components/ArticleCard";
import ListCard from "@/components/ListCard";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import RequireAuth from "@/components/RequireAuth";
import MoreMenu from "@/components/MoreMenu";

import { WidthContext } from "@/context/ScreenContext";
import { UserContext } from "@/context/UserContext";

import { useArticleList } from "@/hooks/useArticleList";
import { useUserLists } from "@/hooks/useUserLists";
import { useUser } from "@/hooks/useUser";
import { useFollow } from "@/hooks/useFollow";
import { parseList } from "@/lib/api/feed";

const PROFILE_TABS = [
    { id: "home", label: "المقالات" },
    { id: "lists", label: "القوائم" },
    { id: "about", label: "حول" },
];

const PROFILE_LINKS = [
    { key: "copy", label: "Copy", icon: Copy },
    { key: "website", label: "website", icon: Globe },
    { key: "link", label: "Link", icon: Link2, iconClassName: "-rotate-45" },
];

const ICON_BUTTON_CLASS =
    "flex items-center justify-center w-10 h-10 rounded-full border border-border text-mid hover:bg-bg cursor-pointer transition-colors";

const MENU_OPTIONS = [
    {
        icon: Pencil,
        label: "تعديل الملف الشخصي",
        type: "normal",
        onClick: () => {},
    },
    {
        icon: Share2,
        label: "مشاركة الملف الشخصي",
        type: "normal",
        onClick: () => {},
    },
    { separator: true },
    {
        icon: Trash2,
        label: "حذف الملف الشخصي",
        type: "red",
        onClick: () => {},
    },
    {
        icon: CircleAlert,
        label: "إبلاغ عن المؤلف",
        type: "red",
        onClick: () => {},
    },
];

const formatCount = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + " ألف";
    return String(n);
};

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
};

const FollowButton = ({ following, isMutating, onToggle }) => (
    <RequireAuth onClick={onToggle} mode="login">
        <Button
            variant={following ? "secondary" : "primary"}
            loading={isMutating}
            style={{ width: "100%" }}
        >
            {following ? "إلغاء المتابعة" : "متابعة"}
        </Button>
    </RequireAuth>
);

const AboutTab = ({ profile, followerCount }) => (
    <div className="py-6">
        <h3 className="text-lg font-bold text-ink mb-3">{profile.name}</h3>
        <p className="text-[15px] text-light leading-[1.8] mb-5">
            {profile.bio}
        </p>
        <div className="flex gap-6 text-sm text-ink">
            <span>
                <strong>{formatCount(followerCount)}</strong>{" "}
                <span className="text-light">متابع</span>
            </span>
            <span>
                <strong>{formatCount(profile.followingCount)}</strong>{" "}
                <span className="text-light">يتابع</span>
            </span>
        </div>
    </div>
);

const ProfilePanel = ({
    profile,
    following,
    followerCount,
    isMutating,
    isOwnProfile,
    onToggleFollow,
}) => {
    const stats = [
        { label: "يتابع", value: formatCount(profile.followingCount) },
        { label: "متابع", value: formatCount(followerCount) },
        { label: "مقالات", value: profile.articlesCount },
    ];

    return (
        <div className="card w-full p-7">
            <div className="flex justify-center">
                <Avatar
                    img={profile.image}
                    initials={getInitials(profile.name)}
                    size={80}
                />
            </div>

            <h1 className="text-xl font-bold text-ink text-center mt-4">
                {profile.name}
            </h1>

            <p className="text-center text-mid text-sm mt-1" dir="ltr">
                @{profile.username}
            </p>

            <p className="text-center text-light text-sm leading-[1.7] mt-3 px-1">
                {profile.bio}
            </p>

            <div
                dir="ltr"
                className="flex items-center justify-center gap-2 mt-5"
            >
                {PROFILE_LINKS.map(
                    ({ key, label, icon: Icon, iconClassName }) => (
                        <button
                            key={key}
                            aria-label={label}
                            className={ICON_BUTTON_CLASS}
                        >
                            <Icon
                                size={16}
                                strokeWidth={2}
                                className={iconClassName}
                            />
                        </button>
                    ),
                )}
            </div>

            <div dir="ltr" className="flex items-stretch justify-center mt-5">
                {stats.flatMap((stat, i) => [
                    i > 0 && (
                        <div key={`divider-${i}`} className="w-px bg-border" />
                    ),
                    <div
                        key={stat.label}
                        className="flex flex-col items-center px-5"
                    >
                        <span className="text-base text-ink">{stat.value}</span>
                        <span dir="rtl" className="text-xs text-mid mt-0.5">
                            {stat.label}
                        </span>
                    </div>,
                ])}
            </div>

            {!isOwnProfile && (
                <div className="mt-5">
                    <FollowButton
                        following={following}
                        isMutating={isMutating}
                        onToggle={onToggleFollow}
                    />
                </div>
            )}
        </div>
    );
};

export default function ProfilePage() {
    const params = useParams();
    const username = params?.username;
    const [tab, setTab] = useState("home");
    const width = useContext(WidthContext);
    const { user } = useContext(UserContext);
    const isMobile = width < 768;

    const { profile, isLoading, error } = useUser(username);

    const {
        isFollowing: following,
        followerCount,
        toggle: toggleFollow,
        isMutating,
    } = useFollow(profile?.id);

    const isOwnProfile = !!user && user.id === profile?.id;

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
                    followerCount={followerCount}
                    isMutating={isMutating}
                    isOwnProfile={isOwnProfile}
                    onToggleFollow={toggleFollow}
                />
            }
            centerMaxWidth={700}
            fullWidthContent={
                profile.bannerUrl && (
                    <div
                        className={`w-250 max-w-full mx-auto overflow-hidden bg-surface-subtle ${
                            isMobile ? "h-32.5" : "h-50"
                        }`}
                    >
                        <img
                            src={profile.bannerUrl}
                            alt=""
                            className="w-full h-full object-cover block"
                        />
                    </div>
                )
            }
        >
            {isMobile && (
                <div className="flex items-center gap-3 mt-4 mb-1">
                    <Avatar
                        img={profile.image}
                        initials={getInitials(profile.name)}
                        size={52}
                        bg="var(--color-accent)"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="text-[17px] font-bold text-ink leading-[1.2]">
                            {profile.name}
                        </div>
                        <div className="text-[13px] text-light">
                            {formatCount(followerCount)} متابع
                        </div>
                    </div>
                    <MoreMenu options={MENU_OPTIONS}>
                        <span className="text-light flex p-1">
                            <MoreHorizontal size={20} />
                        </span>
                    </MoreMenu>
                </div>
            )}

            {isMobile && !isOwnProfile && (
                <div className="my-5">
                    <FollowButton
                        following={following}
                        isMutating={isMutating}
                        onToggle={toggleFollow}
                    />
                </div>
            )}

            {!isMobile && (
                <div className="flex items-start justify-between mt-10 mb-10">
                    <h1 className="text-[32px] font-bold text-ink m-0 leading-[1.15]">
                        {profile.name}
                    </h1>
                    <MoreMenu options={MENU_OPTIONS}>
                        <span className="flex p-1 mt-1.5">
                            <MoreHorizontal size={20} />
                        </span>
                    </MoreMenu>
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
                <AboutTab profile={profile} followerCount={followerCount} />
            ) : tab === "lists" ? (
                <div>
                    {!lists.loading && (
                        <>
                            {lists.items.map((l) => (
                                <ListCard
                                    key={l.id}
                                    list={parseList(l, profile?.name)}
                                    isMobile={isMobile}
                                />
                            ))}
                            {lists.hasMore && (
                                <div className="py-4">
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
                        <div className="py-4">
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
                <div className="py-6 text-mid text-center">
                    لا توجد مقالات بعد
                </div>
            )}
        </AppLayout>
    );
}
