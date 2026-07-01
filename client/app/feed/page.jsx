"use client";

import { useState } from "react";
import { TAGS } from "@/components/constants";
import { ARTICLES, WRITERS } from "@/data/dummybData";
import MobileHeader from "@/components/MobileHeader";
import DesktopHeader from "@/components/DesktopHeader";
import RightSidebar from "@/components/RightSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import ArticleCard from "@/components/ArticleCard";
import Avatar from "@/components/Avatar";
import Tabs from "@/components/Tabs";
import AuthModal from "@/components/AuthModal";

const isAuthenticated = true; // TODO: Replace with actual auth check

const LeftPanel = ({ onLogin, isAuthenticated }) => {
    const [subs, setSubs] = useState(WRITERS.map((w) => w.sub));

    const cardStyle = {
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        padding: "18px 16px",
        marginBottom: 14,
    };

    if (isAuthenticated) {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={cardStyle}>
                    <h4
                        style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--color-ink)",
                            marginBottom: 14,
                        }}
                    >
                        استكشف المواضيع
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {TAGS.map((tag) => (
                            <button
                                key={tag}
                                style={{
                                    background: "var(--color-tag-bg)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 99,
                                    padding: "5px 13px",
                                    fontSize: 12,
                                    color: "var(--color-ink)",
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    transition:
                                        "background 0.15s, border-color 0.15s, color 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "var(--color-accent-light)";
                                    e.currentTarget.style.borderColor = "var(--color-accent)";
                                    e.currentTarget.style.color = "var(--color-accent)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "var(--color-tag-bg)";
                                    e.currentTarget.style.borderColor = "var(--color-border)";
                                    e.currentTarget.style.color = "var(--color-ink)";
                                }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={cardStyle}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 14,
                        }}
                    >
                        <h4
                            style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "var(--color-ink)",
                            }}
                        >
                            كتّاب مقترحون
                        </h4>
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                fontSize: 12,
                                color: "var(--color-accent)",
                                fontFamily: "inherit",
                            }}
                        >
                            عرض الكل
                        </button>
                    </div>
                    {WRITERS.map((w, i) => (
                        <div
                            key={w.name}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                marginBottom: i < WRITERS.length - 1 ? 14 : 0,
                            }}
                        >
                            <Avatar initials={w.avatar} size={36} bg="var(--color-accent)" />
                            <span
                                style={{
                                    flex: 1,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "var(--color-ink)",
                                    lineHeight: 1.3,
                                }}
                            >
                                {w.name}
                            </span>
                            <button
                                onClick={() =>
                                    setSubs((s) =>
                                        s.map((v, j) => (j === i ? !v : v)),
                                    )
                                }
                                style={{
                                    background: subs[i] ? "var(--color-border)" : "var(--color-accent)",
                                    color: subs[i] ? "var(--color-ink)" : "var(--color-white)",
                                    border: "none",
                                    borderRadius: 99,
                                    padding: "5px 12px",
                                    fontSize: 12,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    fontWeight: 600,
                                    flexShrink: 0,
                                    transition: "background 0.15s",
                                }}
                            >
                                {subs[i] ? "متابَع" : "اشترك"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        background: "var(--color-dark-card)",
                        borderRadius: 8,
                        padding: "22px 16px",
                        textAlign: "center",
                        marginBottom: 14,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: 14,
                        }}
                    >
                        <span
                            style={{
                                fontFamily:
                                    "var(--font-wordmark), 'Noto Serif Arabic', serif",
                                fontWeight: 700,
                                fontSize: 22,
                                color: "var(--color-accent-light)",
                                letterSpacing: -0.5,
                                flexShrink: 0,
                                cursor: "pointer",
                                transform: "scaleX(1.1)",
                            }}
                        >
                            مَشْرَقَة
                        </span>
                    </div>
                    <h3
                        style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "var(--color-white)",
                            marginBottom: 8,
                            lineHeight: 1.3,
                        }}
                    >
                        سجّل دخولك أو انضم إلينا
                    </h3>
                    <p
                        style={{
                            fontSize: 13,
                            color: "#aaaaaa",
                            marginBottom: 18,
                            lineHeight: 1.5,
                        }}
                    >
                        انضم إلى أكثر النقاشات إثارةً وعمقاً.
                    </p>
                    <button
                        onClick={onLogin}
                        style={{
                            display: "block",
                            width: "100%",
                            background: "var(--color-accent)",
                            color: "var(--color-white)",
                            border: "none",
                            borderRadius: 6,
                            padding: "12px",
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            marginBottom: 10,
                            transition: "filter 0.15s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.filter = "brightness(1.15)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.filter = "brightness(1)")
                        }
                    >
                        تسجيل الدخول
                    </button>
                    <button
                        style={{
                            display: "block",
                            width: "100%",
                            background: "var(--color-dark-surface)",
                            color: "var(--color-white)",
                            border: "none",
                            borderRadius: 6,
                            padding: "12px",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#3a3a3a")
                        }
                        onMouseLeave={(e) =>
                            (                    e.currentTarget.style.background = "var(--color-dark-surface)")
                        }
                    >
                        انضم إلينا
                    </button>
                </div>

                {/* <p
                    style={{
                        fontSize: 11,
                        color: "var(--color-light)",
                        lineHeight: 1.6,
                        padding: "0 4px",
                    }}
                >
                    <a href="#" style={{ color: "var(--color-light)" }}>
                        شروط الخدمة
                    </a>{" "}
                    ·{" "}
                    <a href="#" style={{ color: "var(--color-light)" }}>
                        الخصوصية
                    </a>{" "}
                    ·{" "}
                    <a href="#" style={{ color: "var(--color-light)" }}>
                        سياسة المحتوى
                    </a>
                </p> */}
            </div>
        );
    }
};

const GlobalStyle = () => (
    <style>{`
    .hide-scroll::-webkit-scrollbar { display: none; }
  `}</style>
);

export default function App() {
    const [tab, setTab] = useState("foryou");
    const [modal, setModal] = useState(null); // null | "signin" | "signup"

    const [width, setWidth] = useState(
        typeof window !== "undefined" ? window.innerWidth : 1200,
    );
    if (typeof window !== "undefined") {
        window.addEventListener("resize", () => setWidth(window.innerWidth), {
            passive: true,
        });
    }
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1100;

    const openLogin = () => setModal("signin");
    const closeModal = () => setModal(null);
    const switchModal = () => setModal(null); // no signup flow; closes modal

    const HEADER_H = 57;

    const tabList = [
        { id: "foryou", label: "لك" },
        { id: "latest", label: "أتابعهم" },
        { id: "trending", label: "الأحدث" },
    ];

    const styles = {
        root: {
            fontFamily: "'Noto Sans Arabic', 'Cairo', 'Segoe UI', sans-serif",
            direction: "rtl",
            background: "var(--color-bg)",
            minHeight: "100vh",
            color: "var(--color-ink)",
        },
        desktopGrid: {
            display: "grid",
            gridTemplateColumns: isTablet ? "240px 1fr" : "240px 1fr 340px",
            width: "100%",
            minHeight: `calc(100vh - ${HEADER_H}px)`,
            alignItems: "start",
        },
        rightSidebarWrap: {
            borderLeft: "1px solid var(--color-border)",
            position: "sticky",
            top: HEADER_H,
            height: `calc(100vh - ${HEADER_H}px)`,
            overflowY: "auto",
        },
        centerWrap: {
            // Fill the full 1fr column, no maxWidth here
            padding: isTablet ? "24px 32px" : "24px 48px",
            minWidth: 0,
            borderLeft: isTablet ? "none" : "1px solid var(--color-border)",
        },
        // Inner wrapper used inside <main> to cap content width and center it
        centerInner: {
            maxWidth: 680,
            margin: "0 auto",
        },
        leftPanelWrap: {
            padding: "24px 20px",
            position: "sticky",
            top: HEADER_H,
            height: `calc(100vh - ${HEADER_H}px)`,
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
        },
    };

    if (isMobile) {
        return (
            <div style={styles.root}>
                <MobileHeader onLogin={openLogin} />
                <main style={{ padding: "16px 14px 80px" }}>
                    <Tabs active={tab} setActive={setTab} tabList={tabList} />
                    {ARTICLES.map((a) => (
                        <ArticleCard key={a.id} article={a} isMobile />
                    ))}
                </main>
                <MobileBottomNav />
                {modal && (
                    <AuthModal
                        mode={modal}
                        onClose={closeModal}
                        onSwitch={switchModal}
                    />
                )}
            </div>
        );
    } else if (isTablet) {
        return (
            <div style={styles.root}>
                <DesktopHeader />
                <div style={styles.desktopGrid}>
                    <div style={styles.rightSidebarWrap}>
                        <RightSidebar />
                    </div>
                    <main style={styles.centerWrap}>
                        <div style={styles.centerInner}>
                            <Tabs
                                active={tab}
                                setActive={setTab}
                                tabList={tabList}
                            />
                            {ARTICLES.map((a) => (
                                <ArticleCard
                                    key={a.id}
                                    article={a}
                                    isMobile={false}
                                />
                            ))}
                        </div>
                    </main>
                </div>
                {modal && (
                    <AuthModal
                        mode={modal}
                        onClose={closeModal}
                        onSwitch={switchModal}
                    />
                )}
            </div>
        );
    } else {
        return (
            <div style={styles.root}>
                <GlobalStyle />
                <DesktopHeader />
                <div style={styles.desktopGrid}>
                    <div style={styles.rightSidebarWrap}>
                        <RightSidebar />
                    </div>
                    <main style={styles.centerWrap}>
                        <div style={styles.centerInner}>
                            <Tabs
                                active={tab}
                                setActive={setTab}
                                tabList={tabList}
                            />
                            {ARTICLES.map((a) => (
                                <ArticleCard
                                    key={a.id}
                                    article={a}
                                    isMobile={false}
                                />
                            ))}
                        </div>
                    </main>
                    <div style={styles.leftPanelWrap} className="hide-scroll">
                        <LeftPanel
                            onLogin={openLogin}
                            isAuthenticated={isAuthenticated}
                        />
                    </div>
                </div>
                {modal && (
                    <AuthModal
                        mode={modal}
                        onClose={closeModal}
                        onSwitch={switchModal}
                    />
                )}
            </div>
        );
    }
}
