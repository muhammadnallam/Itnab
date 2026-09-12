"use client";

import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import Avatar from "@/components/ui/Avatar";
import RequireAuth from "@/components/RequireAuth";
import ConfirmModal from "@/components/ConfirmModal";
import ListPicker from "@/components/ListPicker";
import ShareModal from "@/components/ShareModal";
import MoreMenu from "@/components/MoreMenu";
import {
    Bookmark,
    Ellipsis,
    Pencil,
    Trash2,
    Share2,
    BookmarkPlus,
    UserRoundPlus,
    UserRoundX,
    Copy,
    CircleAlert,
} from "lucide-react";
import { queryKeys } from "@/lib/query-keys";
import { saveArticle, unsaveArticle } from "@/lib/api/interactions";
import { deleteArticle } from "@/lib/api/article";
import { useFollow } from "@/hooks/useFollow";
import { UserContext } from "@/context/UserContext";
import { useAuthModal } from "@/context/AuthModalContext";
import { toast } from "sonner";
import Link from "next/link";

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapArticles(data, mapper) {
    if (!data) return data;
    if (Array.isArray(data.pages)) {
        return {
            ...data,
            pages: data.pages.map((page) => ({
                ...page,
                items: page.items?.map(mapper),
            })),
        };
    }
    if (Array.isArray(data)) return data.map(mapper);
    return data;
}

function filterArticle(data, articleId) {
    if (!data) return data;
    if (Array.isArray(data.pages)) {
        return {
            ...data,
            pages: data.pages.map((page) => ({
                ...page,
                items: page.items?.filter((a) => a.id !== articleId),
            })),
        };
    }
    return data;
}

const LIBRARY_KEYS = ["userSaves", "userViews"];

const ArticleCard = ({ article, isMobile }) => {
    const id = article?.id;
    const saved = article?.saved ?? false;
    const qc = useQueryClient();

    const { user, loading: userLoading } = useContext(UserContext);
    const { openAuth } = useAuthModal();
    const router = useRouter();
    const { isFollowing, toggle: toggleFollow } = useFollow(article.authorId);

    const [removeOpen, setRemoveOpen] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    const isOwner =
        !userLoading &&
        Boolean(user) &&
        user.username === article.authorUsername;

    const articleUrl = () =>
        typeof window !== "undefined"
            ? `${window.location.origin}/article/${article.slug}`
            : "";

    const handleEdit = () => router.push(`/edit/${article.slug}`);

    const handleShare = () => setShareOpen(true);

    const handleCopy = () => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(articleUrl()).then(() => {
                toast.success("تم نسخ الرابط");
            });
        }
    };

    const requireAuth = (action) => {
        if (!user) {
            openAuth("login");
            return false;
        }
        return true;
    };

    const handleSave = () => {
        if (!requireAuth()) return;
        setPickerOpen(true);
    };

    const handleFollow = () => {
        if (!requireAuth()) return;
        toggleFollow();
    };

    const handleReport = () => {
        if (!requireAuth()) return;
        setReportOpen(true);
    };

    const confirmRemove = async () => {
        try {
            setRemoving(true);
            await deleteArticle(id);
            qc.setQueriesData({ queryKey: queryKeys.allArticles() }, (data) =>
                filterArticle(data, id),
            );
            for (const prefix of LIBRARY_KEYS) {
                qc.invalidateQueries({ queryKey: [prefix] });
            }
            setRemoveOpen(false);
            toast.success("تم حذف المقال");
        } catch (err) {
            toast.error(err?.message || "حدث خطأ أثناء حذف المقال");
        } finally {
            setRemoving(false);
        }
    };

    const neutralOptions = [
        { icon: Share2, label: "مشاركة المقال", onClick: handleShare },
        { icon: Copy, label: "نسخ رابط المقال", onClick: handleCopy },
        { icon: BookmarkPlus, label: "حفظ إلى قائمة", onClick: handleSave },
    ];

    const ownerOptions = [
        { icon: Pencil, label: "تعديل المقال", onClick: handleEdit },
        { separator: true },
        ...neutralOptions,
        { separator: true },
        {
            icon: Trash2,
            label: "حذف المقال",
            type: "red",
            onClick: () => setRemoveOpen(true),
        },
    ];

    const guestOptions = [
        {
            icon: isFollowing ? UserRoundX : UserRoundPlus,
            label: isFollowing ? "إلغاء متابعة الكاتب" : "متابعة الكاتب",
            onClick: handleFollow,
        },
        { separator: true },
        ...neutralOptions,
        { separator: true },
        {
            icon: CircleAlert,
            label: "الإبلاغ عن المقال",
            type: "red",
            onClick: handleReport,
        },
    ];

    const options = userLoading
        ? neutralOptions
        : isOwner
          ? ownerOptions
          : guestOptions;

    const mutation = useMutation({
        mutationFn: (save) => (save ? saveArticle(id) : unsaveArticle(id)),
        onMutate: async () => {
            await qc.cancelQueries({ queryKey: queryKeys.allArticles() });
            const previousArticles = qc.getQueriesData({
                queryKey: queryKeys.allArticles(),
            });
            qc.setQueriesData({ queryKey: queryKeys.allArticles() }, (data) =>
                mapArticles(data, (a) =>
                    a.id === id ? { ...a, saved: !saved } : a,
                ),
            );

            const previousLibrary = [];
            for (const prefix of LIBRARY_KEYS) {
                await qc.cancelQueries({ queryKey: [prefix] });
                const prev = qc.getQueriesData({ queryKey: [prefix] });
                previousLibrary.push(...prev);

                if (prefix === "userSaves" && saved) {
                    qc.setQueriesData({ queryKey: [prefix] }, (data) =>
                        filterArticle(data, id),
                    );
                } else {
                    qc.setQueriesData({ queryKey: [prefix] }, (data) =>
                        mapArticles(data, (a) =>
                            a.id === id ? { ...a, saved: !saved } : a,
                        ),
                    );
                }
            }

            return { previous: [...previousArticles, ...previousLibrary] };
        },
        onSuccess: (_data, save) => {
            qc.invalidateQueries({ queryKey: ["list"] });
            if (save) {
                toast.success("تم حفظ المقال");
            } else {
                toast.success("تم إزالة الحفظ", {
                    duration: 5000,
                    action: {
                        label: "تراجع",
                        onClick: () => mutation.mutate(true),
                    },
                });
            }
        },
        onError: (err, _vars, context) => {
            context.previous.forEach(([queryKey, data]) =>
                qc.setQueryData(queryKey, data),
            );
            toast.error(err?.message || "حدث خطأ أثناء تنفيذ العملية");
        },
    });

    const toggleSave = () => {
        if (!UUID_RE.test(id ?? "")) return;
        mutation.mutate(!saved);
    };

    return (
        <article
            style={{
                padding: "24px 0",
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2 mb-2.5 text-sm">
                        <Link
                            href={`/@${article.authorUsername}`}
                            className="flex items-center gap-2"
                        >
                            <Avatar
                                initials={article.authorInitials}
                                img={article.authorImage}
                                size={24}
                                bg="var(--color-accent)"
                            />
                            <span className="font-medium hover:underline">
                                {article.author}
                            </span>
                        </Link>
                        <span className="font-bold">·</span>
                        <span className="text-(--color-light)">
                            {article.date}
                        </span>
                    </div>

                    <a href={`/article/${article.slug}`}>
                        <h2
                            className="font-semibold leading-normal mb-1.5 cursor-pointer"
                            style={{ fontSize: isMobile ? 17 : 20 }}
                        >
                            {article.title}
                        </h2>
                    </a>

                    <p
                        className="leading-relaxed text-sm text-(--color-light) overflow-hidden line-clamp-2"
                        style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {article.excerpt}
                    </p>
                </div>

                {article.image && (
                    <img
                        src={article.image}
                        alt={article.excerpt}
                        className="shrink-0 rounded-sm"
                        style={{
                            width: isMobile ? 88 : 120,
                            height: isMobile ? 88 : 120,
                            objectFit: "cover",
                        }}
                    />
                )}
            </div>

            <div className="flex justify-between gap-2.5 mt-3">
                <div className="flex items-center gap-2.5">
                    <span className="text-xs whitespace-nowrap shrink-0">
                        {article.topic}
                    </span>
                    <span className="text-(--color-light) text-sm font-bold">
                        ·
                    </span>
                    <span className="text-xs whitespace-nowrap shrink-0">
                        {article.readTime} دقائق
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <RequireAuth onClick={toggleSave} mode="login">
                        <button
                            className={`cursor-pointer pl-1 ${
                                saved
                                    ? "text-accent"
                                    : "text-mid hover:text-ink"
                            }`}
                            style={{ transition: "color 0.15s" }}
                        >
                            <Bookmark
                                size={19}
                                fill={saved ? "var(--color-accent)" : "none"}
                                color="currentColor"
                            />
                        </button>
                    </RequireAuth>

                    <MoreMenu options={options}>
                        <Ellipsis size={19} style={{ marginLeft: 4 }} />
                    </MoreMenu>
                </div>
            </div>

            <ConfirmModal
                isOpen={removeOpen}
                icon={Trash2}
                color="var(--color-error)"
                icoBackground="var(--color-error-light)"
                title="حذف المقال"
                description="هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء."
                buttonText="حذف"
                loading={removing}
                onCancel={() => setRemoveOpen(false)}
                onConfirm={confirmRemove}
            />

            <ConfirmModal
                isOpen={reportOpen}
                icon={CircleAlert}
                color="var(--color-error)"
                icoBackground="var(--color-error-light)"
                title="الإبلاغ عن المقال"
                description="شكرًا لك، تم استلام بلاغك وسنراجعه في أقرب وقت."
                buttonText="حسنًا"
                onCancel={() => setReportOpen(false)}
                onConfirm={() => setReportOpen(false)}
            />

            <ListPicker
                open={pickerOpen}
                articleId={id}
                onClose={() => setPickerOpen(false)}
            />

            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                articleId={id}
                url={articleUrl()}
                heading="مشاركة المقال"
                subheading="القراءة أكثر إفادةً عندما نشاركها مع الآخرين"
            />
        </article>
    );
};

export default ArticleCard;
