"use client";

import { useState, useContext } from "react";
import {
    MoreHorizontal,
    Copy,
    Globe,
    Link2,
} from "lucide-react";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import ArticleCard from "@/components/ArticleCard";
import Tabs from "@/components/Tabs";
import AppLayout from "@/components/AppLayout";
import { ARTICLES } from "@/data/dummybData";
import { WidthContext } from "@/context/ScreenContext";

const PROFILE = {
    name: "سارة الأمين",
    initials: "سأ",
    username: "sara_alamien",
    followers: "١٢ ألف",
    following: "٣٤٠",
    articlesCount: 4,
    bio: "كاتبة وباحثة في فلسفة العلوم والمعرفة. أكتب عن العقل والوجود والثقافة العربية. مؤلفة كتاب «حدود اليقين».",
    banner: "https://images.unsplash.com/photo-1784570269737-21da4658a609?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

const PROFILE_TABS = [
    { id: "home", label: "المقالات" },
    { id: "reposts", label: "القوائم" },
    { id: "about", label: "حول" },
];

const profileArticles = ARTICLES.filter((a) => a.author === "سارة الأمين");

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
                <strong>{profile.followers}</strong>{" "}
                <span style={{ color: "var(--color-light)" }}>متابع</span>
            </span>
            <span>
                <strong>{profile.following}</strong>{" "}
                <span style={{ color: "var(--color-light)" }}>يتابع</span>
            </span>
        </div>
    </div>
);

const ProfilePanel = ({ profile, following, onToggleFollow }) => (
    <div
        style={{
            width: "100%",
            background: "var(--color-white)",
            borderRadius: "var(--border-radius)",
            border: "1px solid var(--color-border)",
            padding: 28,
        }}
    >
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Avatar initials={profile.initials} size={80} />
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
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    background: "none",
                    color: "var(--color-mid)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--color-bg)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                }
            >
                <Copy size={16} strokeWidth={2} />
            </button>
            <button
                aria-label="website"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    background: "none",
                    color: "var(--color-mid)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--color-bg)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                }
            >
                <Globe size={16} strokeWidth={2} />
            </button>
            <button
                aria-label="Link"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid var(--color-border)",
                    background: "none",
                    color: "var(--color-mid)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--color-bg)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                }
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
                    {profile.following}
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
                    {profile.followers}
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
            <Button
                onClick={onToggleFollow}
                variant={following ? "secondary" : "primary"}
                style={{
                    width: "100%",
                }}
            >
                {following ? "متابَع" : "متابعة"}
            </Button>
        </div>
    </div>
);

export default function ProfilePage() {
    const [tab, setTab] = useState("home");
    const [following, setFollowing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const width = useContext(WidthContext);
    const isMobile = width < 768;

    const toggleSidebar = () => setSidebarOpen((v) => !v);

    return (
        <AppLayout
            leftPanel={
                <ProfilePanel
                    profile={PROFILE}
                    following={following}
                    onToggleFollow={() => setFollowing((f) => !f)}
                />
            }
            sidebarOpen={sidebarOpen}
            onToggleSidebar={toggleSidebar}
            centerMaxWidth={700}
            fullWidthContent={
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
                    <img
                        src={PROFILE.banner}
                        alt=""
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                </div>
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
                        initials={PROFILE.initials}
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
                            {PROFILE.name}
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                color: "var(--color-light)",
                            }}
                        >
                            {PROFILE.followers} متابع
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
                    <Button
                        onClick={() => setFollowing((f) => !f)}
                        variant={following ? "secondary" : "primary"}
                        style={{
                            width: "100%",
                        }}
                    >
                        {following ? "متابَع" : "متابعة"}
                    </Button>
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
                        {PROFILE.name}
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

            <Tabs active={tab} setActive={setTab} tabList={PROFILE_TABS} />

            {tab === "about" ? (
                <AboutTab profile={PROFILE} />
            ) : (
                profileArticles.map((a) => (
                    <ArticleCard key={a.id} article={a} isMobile={isMobile} />
                ))
            )}
        </AppLayout>
    );
}
