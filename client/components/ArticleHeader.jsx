"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bookmark, Share } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ArticleHeader() {
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const router = useRouter();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        lastScrollY.current = window.scrollY;

        const handleScroll = () => {
            if (ticking.current) return;
            ticking.current = true;

            window.requestAnimationFrame(() => {
                const currentY = window.scrollY;
                const delta = currentY - lastScrollY.current;
                const REVEAL_THRESHOLD = 4;

                if (currentY <= 52) {
                    setHidden(false);
                } else if (delta > REVEAL_THRESHOLD) {
                    setHidden(true);
                } else if (delta < -REVEAL_THRESHOLD) {
                    setHidden(false);
                }

                lastScrollY.current = currentY;
                ticking.current = false;
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`article-header${hidden ? " article-header-hidden" : ""}`}
        >
            <a href="/">
                <span
                    style={{
                        fontFamily: "var(--font-wordmark)",
                        fontWeight: 400,
                        fontSize: 28,
                        color: "var(--color-accent)",
                        letterSpacing: -0.5,
                        flexShrink: 0,
                        cursor: "pointer",
                        transform: "scaleX(1.1)",
                    }}
                >
                    إطناب
                </span>
            </a>

            <div className="article-header-icons">
                <button
                    aria-label="share article"
                    style={{
                        cursor: "pointer",
                        color: "var(--color-mid)",
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-ink)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                >
                    <Share size={24} />
                </button>
                <button
                    aria-label="save article"
                    onClick={() => setSaved((s) => !s)}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-accent)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                >
                    <Bookmark
                        size={24}
                        fill={saved ? "var(--color-accent)" : "none"}
                        color={
                            saved ? "var(--color-accent)" : "var(--color-mid)"
                        }
                    />
                </button>
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-mid)",
                        fontSize: 15,
                        padding: "4px 6px",
                        borderRadius: 6,
                        textDecoration: "none",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-ink)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                    onClick={() => {
                        router.push("/");
                    }}
                >
                    رجوع
                    <ArrowLeft size={24} />
                </button>
            </div>
        </header>
    );
}
