"use client";

import { useState, useEffect } from "react";

import DesktopHeader from "@/components/DesktopHeader";
import MobileHeader from "@/components/MobileHeader";
import RightSidebar from "@/components/RightSidebar";
import ArticleCard from "@/components/ArticleCard";
import MobileBottomNav from "@/components/MobileBottomNav";
import Avatar from "@/components/Avatar";
import ArticleActionBar from "@/components/ArticleActionBar";
import CommentsSection from "@/components/CommentsSection";
import {
    Heart,
    MessageSquare,
    Share,
    Ellipsis,
} from "lucide-react";
import {
    ARTICLE,
    RESPONSES,
    MORE_FROM_AUTHOR,
    READ_MORE,
} from "@/data/dummybData";

const ArticleContent = ({ blocks }) => (
    <div style={{ direction: "rtl" }}>
        {blocks.map((block, i) => {
            if (block.type === "p")
                return (
                    <p
                        key={i}
                        style={{
                            fontSize: 19,
                            lineHeight: 1.8,
                            color: "var(--color-ink)",
                            marginBottom: 24,
                            fontWeight: 400,
                        }}
                    >
                        {block.text}
                    </p>
                );
            if (block.type === "h2")
                return (
                    <h2
                        key={i}
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: "var(--color-ink)",
                            marginTop: 48,
                            marginBottom: 20,
                            lineHeight: 1.3,
                        }}
                    >
                        {block.text}
                    </h2>
                );
            if (block.type === "quote")
                return (
                    <blockquote
                        key={i}
                        style={{
                            borderRight: "3px solid var(--color-accent)",
                            paddingRight: 20,
                            margin: "32px 0",
                            fontSize: 19,
                            fontStyle: "italic",
                            color: "var(--color-mid)",
                            lineHeight: 1.8,
                        }}
                    >
                        {block.text}
                    </blockquote>
                );
            return null;
        })}
    </div>
);

const RelatedCard = ({ article }) => (
    <div style={{ cursor: "pointer" }}>
        <img
            src={article.image}
            alt=""
            style={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "cover",
                borderRadius: 0,
                marginBottom: 12,
                display: "block",
            }}
        />
        <div
            style={{ fontSize: 13, color: "var(--color-mid)", marginBottom: 8 }}
        >
            {article.boosted && (
                <span style={{ color: "var(--color-gold)", marginLeft: 4 }}>
                    ★
                </span>
            )}
            في {article.pub} · {article.date}
        </div>
        <h4
            style={{
                fontSize: 17,
                fontWeight: 700,
                color: "var(--color-ink)",
                lineHeight: 1.3,
                marginBottom: 8,
            }}
        >
            {article.title}
        </h4>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {article.boosted && (
                            <span style={{ color: "var(--color-gold)", fontSize: 13 }}>
                                ★
                            </span>
                        )}
                        <Heart size={16} />
                        <span style={{ fontSize: 13, color: "var(--color-mid)" }}>
                            {article.claps}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MessageSquare size={16} />
                        <span style={{ fontSize: 13, color: "var(--color-mid)" }}>
                            {article.comments}
                        </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Share size={16} />
                        <span style={{ fontSize: 13, color: "var(--color-mid)" }}>
                            {article.reposts}
                        </span>
                    </div>
                    <div style={{ flex: 1 }} />
                    <button
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--color-mid)",
                            padding: 0,
                        }}
                    >
                        <Ellipsis size={16} />
            </button>
        </div>
    </div>
);

export default function ArticlePage() {
    // TODO: Remove useState and "use client" to use SSG/SSR for better performance and SEO.
    const [saved, setSaved] = useState(false);
    const [followed, setFollowed] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [width, setWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1200,
    );

    useEffect(() => {
        const h = () => setWidth(window.innerWidth);
        window.addEventListener("resize", h, { passive: true });
        return () => window.removeEventListener("resize", h);
    }, []);

    const isMobile = width < 768;
    const isTablet = width < 1100;
    const HEADER_H = isMobile ? 56 : 57;

    const toggleSidebar = () => setSidebarOpen((v) => !v);

    const sidebarStyle = {
        borderLeft: "1px solid var(--color-border)",
        position: "sticky",
        top: HEADER_H,
        height: `calc(100vh - ${HEADER_H}px)`,
        overflow: "hidden",
        width: sidebarOpen ? 240 : 0,
        flexShrink: 0,
        transition: "width 0.3s ease",
    };

    return (
        <div
            style={{
                direction: "rtl",
                background: "var(--color-white)",
                minHeight: "100vh",
                color: "var(--color-ink)",
            }}
        >
            {isMobile ? (
                <MobileHeader hasNotification={false} />
            ) : (
                <DesktopHeader searchBorder={false} onToggleSidebar={toggleSidebar} />
            )}

            <div style={{ display: "flex" }}>
                {!isMobile && (
                    <div style={sidebarStyle}>
                        <RightSidebar sidebarOpen={sidebarOpen} activeItem="" />
                    </div>
                )}

                <main
                    style={{
                        flex: 1,
                        minWidth: 0,
                        padding: isMobile ? "24px 16px 80px" : "40px 48px 80px",
                    }}
                >
                    <div style={{ maxWidth: 680, margin: "0 auto" }}>
                        <div style={{ marginBottom: 32 }}>
                            {ARTICLE.boosted && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        marginBottom: 12,
                                    }}
                                >
                                    <span
                                        style={{
                                            color: "var(--color-gold)",
                                            fontSize: 13,
                                        }}
                                    >
                                        ★
                                    </span>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: "var(--color-mid)",
                                        }}
                                    >
                                        قصة للمشتركين فقط
                                    </span>
                                </div>
                            )}

                            <h1
                                style={{
                                    fontSize: isMobile ? 24 : 32,
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                    color: "var(--color-ink)",
                                    marginBottom: 16,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                {ARTICLE.title}
                            </h1>

                            <p
                                style={{
                                    fontSize: isMobile ? 17 : 19,
                                    color: "var(--color-mid)",
                                    lineHeight: 1.8,
                                    marginBottom: 24,
                                    fontWeight: 400,
                                }}
                            >
                                {ARTICLE.subtitle}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginBottom: 20,
                                    borderBottom:
                                        "1px solid var(--color-border)",
                                    paddingBottom: "20px",
                                }}
                            >
                                <Avatar
                                    initials={ARTICLE.authorAvatar}
                                    size={44}
                                    bg="var(--color-accent)"
                                />
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            marginBottom: 4,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 500,
                                                color: "var(--color-ink)",
                                            }}
                                        >
                                            {ARTICLE.author}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setFollowed((f) => !f)
                                            }
                                            style={{
                                                background: "none",
                                                border: `1px solid ${followed ? "var(--color-border)" : "var(--color-ink)"}`,
                                                borderRadius: 99,
                                                padding: "3px 12px",
                                                fontSize: 13,
                                                color: followed
                                                    ? "var(--color-mid)"
                                                    : "var(--color-ink)",
                                                cursor: "pointer",
                                                fontWeight: 500,
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            {followed ? "متابَع" : "متابعة"}
                                        </button>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            fontSize: 13,
                                            color: "var(--color-mid)",
                                        }}
                                    >
                                        <span>{ARTICLE.pub}</span>
                                        <span>·</span>
                                        <span
                                            style={{
                                                whiteSpace: "nowrap",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {ARTICLE.readTime} دقائق قراءة
                                        </span>
                                        <span>·</span>
                                        <span>{ARTICLE.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <img
                            src={ARTICLE.coverImage}
                            alt={ARTICLE.title}
                            style={{
                                width: "100%",
                                aspectRatio: "16/9",
                                objectFit: "cover",
                                marginBottom: 40,
                                display: "block",
                            }}
                        />

                        <ArticleContent blocks={ARTICLE.content} />

                        <ArticleActionBar
                            claps={ARTICLE.claps}
                            comments={ARTICLE.comments}
                            reposts={ARTICLE.reposts}
                            saved={saved}
                            onSave={() => setSaved((s) => !s)}
                        />

                        <div
                            style={{
                                borderTop: "1px solid var(--color-border)",
                                borderBottom: "1px solid var(--color-border)",
                                padding: "24px 0",
                                marginTop: 48,
                                marginBottom: 48,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 16,
                                }}
                            >
                                <Avatar
                                    initials={ARTICLE.authorAvatar}
                                    size={56}
                                    bg="var(--color-accent)"
                                />
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            marginBottom: 8,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: 17,
                                                fontWeight: 500,
                                                color: "var(--color-ink)",
                                            }}
                                        >
                                            {ARTICLE.author}
                                        </span>
                                        <button
                                            onClick={() =>
                                                setFollowed((f) => !f)
                                            }
                                            style={{
                                                background: followed
                                                    ? "none"
                                                    : "var(--color-accent)",
                                                border: `1px solid ${followed ? "var(--color-border)" : "var(--color-accent)"}`,
                                                color: followed
                                                    ? "var(--color-mid)"
                                                    : "var(--color-white)",
                                                borderRadius: 99,
                                                padding: "5px 16px",
                                                fontSize: 13,
                                                cursor: "pointer",
                                                fontWeight: 500,
                                                transition: "all 0.15s",
                                            }}
                                        >
                                            {followed ? "متابَع" : "متابعة"}
                                        </button>
                                    </div>
                                    <p
                                        style={{
                                            fontSize: 15,
                                            color: "var(--color-mid)",
                                            lineHeight: 1.8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {ARTICLE.authorBio}
                                    </p>
                                    <span
                                        style={{
                                            fontSize: 13,
                                            color: "var(--color-gold)",
                                        }}
                                    >
                                        {ARTICLE.authorFollowers} متابع
                                    </span>
                                </div>
                            </div>
                        </div>

                        <CommentsSection
                            responses={RESPONSES}
                            count={ARTICLE.comments}
                        />

                        <section style={{ marginTop: 64 }}>
                            <h3
                                style={{
                                    fontSize: 19,
                                    fontWeight: 700,
                                    color: "var(--color-ink)",
                                    marginBottom: 24,
                                }}
                            >
                                المزيد من {ARTICLE.author} و
                                {ARTICLE.pub.replace("في ", "")}
                            </h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: isMobile
                                        ? "1fr"
                                        : "1fr 1fr",
                                    gap: 24,
                                }}
                            >
                                {MORE_FROM_AUTHOR.map((a) => (
                                    <RelatedCard key={a.id} article={a} />
                                ))}
                            </div>

                            <div
                                style={{
                                    textAlign: "center",
                                    marginTop: 32,
                                }}
                            >
                                <button
                                    style={{
                                        background: "none",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 99,
                                        padding: "8px 24px",
                                        fontSize: 13,
                                        color: "var(--color-ink)",
                                        cursor: "pointer",
                                        transition: "border-color 0.15s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            "var(--color-accent)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.borderColor =
                                            "var(--color-border)")
                                    }
                                >
                                    عرض المزيد من {ARTICLE.author}
                                </button>
                            </div>
                        </section>

                        <section
                            style={{
                                marginTop: 64,
                                paddingTop: 40,
                                borderTop: "1px solid var(--color-border)",
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: 19,
                                    fontWeight: 700,
                                    color: "var(--color-ink)",
                                    marginBottom: 4,
                                }}
                            >
                                موصى به لك
                            </h3>
                            <p
                                style={{
                                    fontSize: 13,
                                    color: "var(--color-mid)",
                                    marginBottom: 24,
                                }}
                            >
                                بناءً على ما تقرأه
                            </p>
                            {READ_MORE.map((a) => (
                                <ArticleCard
                                    key={a.id}
                                    article={a}
                                    isMobile={isMobile}
                                />
                            ))}
                        </section>
                    </div>
                </main>
            </div>

            {isMobile && <MobileBottomNav />}
        </div>
    );
}
