"use client";

import { useState, useContext } from "react";
import { TAGS } from "@itnab/constants";
import { ARTICLES, WRITERS } from "@/data/dummybData";
import AppLayout from "@/components/AppLayout";
import ArticleCard from "@/components/ArticleCard";
import Avatar from "@/components/Avatar";
import Tabs from "@/components/ui/Tabs";
import AuthModal from "@/components/AuthModal";
import { UserContext } from "@/context/UserContext";
import { WidthContext } from "@/context/ScreenContext";
import Button from "@/components/ui/Button";

const LeftPanel = ({ onLogin, onSignUp }) => {
    const [subs, setSubs] = useState(WRITERS.map((w) => w.sub));
    const { user } = useContext(UserContext);

    if (!user) {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <div
                    className="card"
                    style={{
                        textAlign: "center",
                        marginBottom: 16,
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
                    <Button
                        onClick={onLogin}
                        type="primary"
                        style={{ width: "100%", marginBottom: 12 }}
                    >
                        تسجيل الدخول
                    </Button>
                    <Button
                        onClick={onSignUp}
                        variant="dark"
                        style={{ width: "100%" }}
                    >
                        انضم إلينا
                    </Button>
                </div>
            </div>
        );
    } else {
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="card mb-4">
                    <h4
                        style={{
                            fontSize: 15,
                            fontWeight: 700,
                            marginBottom: 16,
                        }}
                    >
                        استكشف المواضيع
                    </h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {TAGS.map((tag) => (
                            <a
                                href={`/tag/${tag}`}
                                key={tag}
                                style={{
                                    background: "var(--color-tag-bg)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 99,
                                    padding: "6px 16px",
                                    fontSize: 13,
                                    cursor: "pointer",
                                    transition:
                                        "background 0.15s, border-color 0.15s, color 0.15s",
                                }}
                            >
                                {tag}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="card mb-4">
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

    const openLogin = () => setModal("login");
    const openSignUp = () => setModal("signup");
    const closeModal = () => setModal(null);
    const toggleSidebar = () => setSidebarOpen((v) => !v);

    const tabList = [
        { id: "foryou", label: "لك" },
        { id: "latest", label: "الأحدث" },
    ];

    return (
        <>
            <AppLayout
                leftPanel={
                    <LeftPanel onLogin={openLogin} onSignUp={openSignUp} />
                }
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
