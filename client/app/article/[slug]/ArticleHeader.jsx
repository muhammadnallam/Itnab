"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bookmark, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { useSave } from "@/hooks/useSave";

export default function ArticleHeader({ article }) {
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const router = useRouter();
    const { saved, toggle: toggleSave } = useSave(article?.id);

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
            <Link href="/">
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
            </Link>

            <div className="article-header-icons">
                <button
                    aria-label="share article"
                    className="text-mid hover:text-ink"
                    style={{
                        cursor: "pointer",
                        transition: "color 0.15s",
                        background: "none",
                        border: "none",
                        padding: 0,
                    }}
                >
                    <Download size={24} />
                </button>
                <RequireAuth onClick={toggleSave}>
                    <button
                        aria-label="save article"
                        className={
                            saved ? "text-accent" : "text-mid hover:text-accent"
                        }
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            transition: "color 0.15s",
                        }}
                    >
                        <Bookmark
                            size={24}
                            fill={saved ? "var(--color-accent)" : "none"}
                            color="currentColor"
                        />
                    </button>
                </RequireAuth>
                <button
                    className="text-mid hover:text-ink"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 15,
                        padding: "4px 6px",
                        borderRadius: 6,
                        textDecoration: "none",
                    }}
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
