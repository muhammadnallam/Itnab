"use client";

import { useState, useContext } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    MoreHorizontal,
    Copy,
    Globe,
    Pencil,
    Share2,
    CircleAlert,
} from "lucide-react";
import { X, YouTube } from "@/components/ui/icons";
import AppLayout from "@/components/AppLayout";
import Tabs from "@/components/ui/Tabs";
import ArticleCard from "@/components/ArticleCard";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";
import ListCard from "@/components/ListCard";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import RequireAuth from "@/components/RequireAuth";
import MoreMenu from "@/components/MoreMenu";
import FollowListModal from "@/app/profile/[username]/FollowListModal";
import ShareModal from "@/components/ShareModal";

import { WidthContext } from "@/context/ScreenContext";
import { UserContext } from "@/context/UserContext";

import { useArticleList } from "@/hooks/useArticleList";
import { useLists } from "@/hooks/useLists";
import { useUser } from "@/hooks/useUser";
import { useFollow } from "@/hooks/useFollow";
import { parseList } from "@/lib/api/feed";

const PROFILE_TABS = [
    { id: "home", label: "المقالات" },
    { id: "lists", label: "القوائم" },
    { id: "about", label: "حول" },
];

const SOCIAL_LINKS = [
    { key: "website", icon: Globe },
    { key: "youtube", icon: YouTube },
    { key: "x", icon: X },
];

const ICON_BUTTON_CLASS =
    "flex items-center justify-center w-10 h-10 rounded-full border border-border text-mid hover:bg-bg cursor-pointer transition-colors";

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
        {SOCIAL_LINKS.filter(({ key }) => profile.socialLinks?.[key]).length > 0 && (
            <div dir="rtl" className="flex items-center gap-2 mt-5">
                {SOCIAL_LINKS.filter(({ key }) => profile.socialLinks?.[key]).map(
                    ({ key, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => window.open(profile.socialLinks[key], "_blank", "noopener")}
                            className="flex items-center justify-center w-10 h-10 rounded-full border border-border text-mid hover:bg-bg cursor-pointer transition-colors"
                        >
                            <Icon size={16} strokeWidth={2} />
                        </button>
                    ),
                )}
            </div>
        )}
    </div>
);

const ProfilePanel = ({
    profile,
    following,
    followerCount,
    isMutating,
    isOwnProfile,
    onToggleFollow,
    onFollowersClick,
    onFollowingClick,
}) => {
    const stats = [
        { label: "يتابع", value: formatCount(profile.followingCount), onClick: profile.followingCount > 0 ? onFollowingClick : null },
        { label: "متابع", value: formatCount(followerCount), onClick: followerCount > 0 ? onFollowersClick : null },
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

            {SOCIAL_LINKS.filter(({ key }) => profile.socialLinks?.[key]).length > 0 && (
                <div
                    dir="ltr"
                    className="flex items-center justify-center gap-2 mt-5"
                >
                    {SOCIAL_LINKS.filter(({ key }) => profile.socialLinks?.[key]).map(
                        ({ key, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => window.open(profile.socialLinks[key], "_blank", "noopener")}
                                className={ICON_BUTTON_CLASS}
                            >
                                <Icon
                                    size={16}
                                    strokeWidth={2}
                                />
                            </button>
                        ),
                    )}
                </div>
            )}

            <div dir="ltr" className="flex items-stretch justify-center mt-5">
                {stats.flatMap((stat, i) => [
                    i > 0 && (
                        <div key={`divider-${i}`} className="w-px bg-border" />
                    ),
                    <div
                        key={stat.label}
                        className="flex flex-col items-center px-5"
                        onClick={stat.onClick}
                        style={{
                            cursor: stat.onClick ? "pointer" : "default",
                        }}
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
    const router = useRouter();
    const { user, loading: userLoading } = useContext(UserContext);
    const isMobile = width < 768;

    const { profile, isLoading, error } = useUser(username);

    const {
        isFollowing: following,
        followerCount,
        toggle: toggleFollow,
        isMutating,
    } = useFollow(profile?.id);

    const isOwnProfile = !!user && user.id === profile?.id;

    const [followModal, setFollowModal] = useState(null);
    const [shareOpen, setShareOpen] = useState(false);

    const handleShare = () => setShareOpen(true);

    const handleCopy = () => {
        const url = `${window.location.origin}/@${profile.username}`;
        navigator.clipboard?.writeText(url).then(() => {
            toast.success("تم نسخ الرابط");
        });
    };

    const ownerOptions = [
        { icon: Pencil, label: "تعديل الملف الشخصي", onClick: () => {router.push("/settings")} },
        { separator: true },
        { icon: Share2, label: "مشاركة الملف الشخصي", onClick: handleShare },
        { icon: Copy, label: "نسخ رابط الملف الشخصي", onClick: handleCopy },
    ];

    const guestOptions = [
        { icon: Share2, label: "مشاركة الملف الشخصي", onClick: handleShare },
        { icon: Copy, label: "نسخ رابط الملف الشخصي", onClick: handleCopy },
        { separator: true },
        { icon: CircleAlert, label: "إبلاغ عن المؤلف", type: "red", onClick: () => {} },
    ];

    const menuOptions = userLoading
        ? []
        : isOwnProfile
          ? ownerOptions
          : guestOptions;

    // Articles tab is focused first; lists are prefetched right after.
    const articles = useArticleList(
        { sort: "new", author: profile?.id },
        { enabled: Boolean(profile) },
    );
    const lists = useLists({ author: profile?.id, enabled: Boolean(profile) });

    const [prevUsername, setPrevUsername] = useState(username);
    if (prevUsername !== username) {
        setPrevUsername(username);
        setTab("home");
    }

    if (error) notFound();

    const banner = profile?.bannerUrl?.trim() ? (
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
    ) : null;

    if (isLoading || !profile) {
        return (
            <AppLayout
                leftPanel={
                    <div className="card w-full p-7">
                        <div className="flex justify-center">
                            <div
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    background: "var(--color-tag-bg)",
                                    animation:
                                        "pulse 1.5s ease-in-out infinite",
                                }}
                            />
                        </div>
                        <div
                            style={{
                                width: "60%",
                                height: 18,
                                borderRadius: 4,
                                background: "var(--color-tag-bg)",
                                margin: "16px auto 0",
                                animation:
                                    "pulse 1.5s ease-in-out infinite",
                            }}
                        />
                        <div
                            style={{
                                width: "40%",
                                height: 12,
                                borderRadius: 4,
                                background: "var(--color-tag-bg)",
                                margin: "8px auto 0",
                                animation:
                                    "pulse 1.5s ease-in-out infinite",
                            }}
                        />
                        <div
                            style={{
                                width: "100%",
                                height: 36,
                                borderRadius: "var(--border-radius)",
                                background: "var(--color-tag-bg)",
                                marginTop: 20,
                                animation:
                                    "pulse 1.5s ease-in-out infinite",
                            }}
                        />
                    </div>
                }
                centerMaxWidth={700}
                fullWidthContent={banner}
            >
                <Tabs
                    active={tab}
                    setActive={setTab}
                    tabList={PROFILE_TABS}
                    loading={false}
                />
                {[1, 2, 3].map((i) => (
                    <ArticleCardSkeleton key={i} isMobile={isMobile} />
                ))}
            </AppLayout>
        );
    }

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
                    onFollowersClick={() => setFollowModal("followers")}
                    onFollowingClick={() => setFollowModal("following")}
                />
            }
            centerMaxWidth={700}
            fullWidthContent={banner}
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
                        <div className="flex gap-3 text-[13px] text-light">
                            <span
                                onClick={followerCount > 0 ? () => setFollowModal("followers") : undefined}
                                style={{ cursor: followerCount > 0 ? "pointer" : "default" }}
                            >
                                {formatCount(followerCount)} متابع
                            </span>
                            <span
                                onClick={profile.followingCount > 0 ? () => setFollowModal("following") : undefined}
                                style={{ cursor: profile.followingCount > 0 ? "pointer" : "default" }}
                            >
                                {formatCount(profile.followingCount)} يتابع
                            </span>
                        </div>
                    </div>
                    <MoreMenu options={menuOptions}>
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
                    <MoreMenu options={menuOptions}>
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
                loading={false}
            />

            {tab === "about" ? (
                <AboutTab profile={profile} followerCount={followerCount} />
            ) : tab === "lists" ? (
                <div>
                    {lists.loading ? (
                        <>
                            {[1, 2, 3].map((i) => (
                                <ArticleCardSkeleton key={i} isMobile={isMobile} />
                            ))}
                        </>
                    ) : (
                        <>
                            {lists.items.map((l) => (
                                <ListCard
                                    key={l.id}
                                    list={parseList(l, profile?.name)}
                                    isMobile={isMobile}
                                    isOwner={isOwnProfile}
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
            ) : articles.loading ? (
                <>
                    {[1, 2, 3].map((i) => (
                        <ArticleCardSkeleton key={i} isMobile={isMobile} />
                    ))}
                </>
            ) : articles.items.length ? (
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
            <FollowListModal
                open={followModal !== null}
                onClose={() => setFollowModal(null)}
                type={followModal}
                userId={profile?.id}
            />
            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                url={profile ? `${window.location.origin}/@${profile.username}` : ""}
                heading="مشاركة الملف الشخصي"
                subheading="شارك هذا الملف الشخصي مع الآخرين"
            />
        </AppLayout>
    );
}
