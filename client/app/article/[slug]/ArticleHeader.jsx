"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, FileDown, Loader2, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ShareModal from "@/components/ShareModal";
import { getArticleUrl } from "@/lib/share";
import { downloadPdf } from "@/lib/api/article";
import { toast } from "sonner";

export default function ArticleHeader({ article }) {
    const [hidden, setHidden] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const router = useRouter();

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

    const handleDownload = async () => {
        if (downloading) return;
        setDownloading(true);
        try {
            await downloadPdf(article.slug);
        } catch {
            toast.error("حدث خطأ أثناء تحميل ال PDF");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <>
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
                        aria-label="download article"
                        className="text-mid hover:text-ink"
                        onClick={handleDownload}
                        disabled={downloading}
                        style={{
                            cursor: downloading ? "wait" : "pointer",
                            transition: "color 0.15s",
                            background: "none",
                            border: "none",
                            padding: 0,
                            opacity: downloading ? 0.6 : 1,
                        }}
                    >
                        {downloading ? (
                            <Loader2 size={24} className="animate-spin" />
                        ) : (
                            <FileDown size={23} />
                        )}
                    </button>
                    <button
                        aria-label="share article"
                        className="text-mid hover:text-ink"
                        onClick={() => setShareOpen(true)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            transition: "color 0.15s",
                        }}
                    >
                        <Share2 size={24} />
                    </button>
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
                            router.back();
                        }}
                    >
                        رجوع
                        <ArrowLeft size={24} />
                    </button>
                </div>
            </header>

            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                articleId={article?.id}
                url={getArticleUrl(article?.slug)}
                heading="مشاركة المقال"
                subheading="القراءة أكثر إفادةً عندما نشاركها مع الآخرين"
            />
        </>
    );
}
