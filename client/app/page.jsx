"use client";

import { useState, useContext } from "react";
import { TAGS } from "@/components/constants";
import { ARTICLES, WRITERS } from "@/data/dummybData";
import AppLayout from "@/components/AppLayout";
import ArticleCard from "@/components/ArticleCard";
import Avatar from "@/components/Avatar";
import Tabs from "@/components/Tabs";
import AuthModal from "@/components/AuthModal";
import { UserContext } from "@/context/UserContext";
import { WidthContext } from "@/context/ScreenContext";

const LeftPanel = ({ onLogin, onSignUp }) => {
    const [subs, setSubs] = useState(WRITERS.map((w) => w.sub));
    const { user } = useContext(UserContext);

    const cardStyle = {
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--border-radius)",
        padding: "24px 20px",
        marginBottom: 16,
    };

    if (!user) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    
                }}
            >
                <div
                    style={{
                        border: "1px solid var(--color-border)",
                        borderRadius: 0,
                        padding: "24px 20px",
                        textAlign: "center",
                        marginBottom: 16,
                        borderRadius: "var(--border-radius)",
                        background: "var(--color-surface)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: 12,
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "var(--font-wordmark)",
                                fontWeight: 400,
                                fontSize: 28,
                                marginBottom: "4px",
                                color: "var(--color-accent)",
                                letterSpacing: -0.5,
                                flexShrink: 0,
                                cursor: "pointer",
                            }}
                        >
                            إطناب
                        </span>
                    </div>
                    <h3
                        style={{
                            fontSize: 17,
                            fontWeight: 700,
                            // color: "var(--color-white)",
                            marginBottom: 8,
                            lineHeight: 1.3,
                        }}
                    >
                        سجّل دخولك أو انضم إلينا
                    </h3>
                    <p
                        style={{
                            fontSize: 15,
                            color: "var(--color-light)",
                            marginBottom: 24,
                            lineHeight: 1.8,
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
                            padding: "12px 16px",
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: "pointer",
                            marginBottom: 12,
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
                        onClick={onSignUp}
                        style={{
                            display: "block",
                            width: "100%",
                            background: "var(--color-dark-surface)",
                            color: "var(--color-white)",
                            border: "none",
                            borderRadius: 6,
                            padding: "12px 16px",
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#3a3a3a")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                "var(--color-dark-surface)")
                        }
                    >
                        انضم إلينا
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={cardStyle}>
                    <h4
                        style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "var(--color-ink)",
                            marginBottom: 16,
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
                                    padding: "6px 16px",
                                    fontSize: 13,
                                    color: "var(--color-ink)",
                                    cursor: "pointer",
                                    transition:
                                        "background 0.15s, border-color 0.15s, color 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background =
                                        "var(--color-accent-light)";
                                    e.currentTarget.style.borderColor =
                                        "var(--color-accent)";
                                    e.currentTarget.style.color =
                                        "var(--color-accent)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background =
                                        "var(--color-tag-bg)";
                                    e.currentTarget.style.borderColor =
                                        "var(--color-border)";
                                    e.currentTarget.style.color =
                                        "var(--color-ink)";
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
                            marginBottom: 16,
                        }}
                    >
                        <h4
                            style={{
                                fontSize: 15,
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
                                fontSize: 13,
                                color: "var(--color-accent)",
                                transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                    "var(--color-accent-hover)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                    "var(--color-accent)")
                            }
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
                                gap: 12,
                                marginBottom: i < WRITERS.length - 1 ? 16 : 0,
                            }}
                        >
                            <Avatar
                                initials={w.avatar}
                                size={40}
                                bg="var(--color-accent)"
                            />
                            <span
                                style={{
                                    flex: 1,
                                    fontSize: 15,
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
                                    background: subs[i]
                                        ? "var(--color-accent-light)"
                                        : "var(--color-accent)",
                                    color: subs[i]
                                        ? "var(--color-ink)"
                                        : "var(--color-white)",
                                    border: "none",
                                    borderRadius: 99,
                                    padding: "6px 16px",
                                    fontSize: 13,
                                    cursor: "pointer",
                                    fontWeight: 500,
                                    flexShrink: 0,
                                    transition: "background 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    if (subs[i]) {
                                        e.currentTarget.style.background =
                                            "#d0d0d0";
                                    } else {
                                        e.currentTarget.style.background =
                                            "var(--color-accent-hover)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = subs[i]
                                        ? "var(--color-border)"
                                        : "var(--color-accent)";
                                }}
                            >
                                {subs[i] ? "متابَع" : "اشترك"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
};

export default function App() {
    const [tab, setTab] = useState("foryou");
    const [modal, setModal] = useState(null); // null | "signin" | "signup"
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const width = useContext(WidthContext);

    const isMobile = width < 768;

    const openLogin = () => setModal("signin");
    const openSignUp = () => setModal("signup");
    const closeModal = () => setModal(null);
    const toggleSidebar = () => setSidebarOpen((v) => !v);

    const tabList = [
        { id: "foryou", label: "لك" },
        { id: "latest", label: "أتابعهم" },
        { id: "trending", label: "الأحدث" },
    ];

    return (
        <>
            <AppLayout
                leftPanel={<LeftPanel onLogin={openLogin} onSignUp={openSignUp} />}
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
                onLogin={openLogin}
            >
                <Tabs active={tab} setActive={setTab} tabList={tabList} />
                {ARTICLES.map((a) => (
                    <ArticleCard key={a.id} article={a} isMobile={isMobile} />
                ))}
            </AppLayout>
            {modal && (
                <AuthModal
                    open={Boolean(modal)}
                    defaultMode={modal}
                    onClose={closeModal}
                />
            )}
        </>
    );
}
