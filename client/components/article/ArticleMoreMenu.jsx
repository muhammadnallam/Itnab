"use client";

import { useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import MoreMenu from "@/components/MoreMenu";
import ConfirmModal from "@/components/ConfirmModal";
import ListPicker from "@/components/ListPicker";
import ShareModal from "@/components/ShareModal";
import { getArticleUrl } from "@/lib/share";
import {
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
import { deleteArticle } from "@/lib/api/article";
import { useFollow } from "@/hooks/useFollow";
import { UserContext } from "@/context/UserContext";
import { useAuthModal } from "@/context/AuthModalContext";
import { toast } from "sonner";

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

function cleanOptions(options) {
    const result = [];
    let prevSep = true;
    for (const item of options) {
        if (item.separator) {
            if (!prevSep) prevSep = true;
            continue;
        }
        if (prevSep && result.length > 0) {
            result.push({ separator: true });
        }
        result.push(item);
        prevSep = false;
    }
    if (result.length > 0 && result[result.length - 1].separator) {
        result.pop();
    }
    return result;
}

export default function ArticleMoreMenu({
    article,
    isOwner,
    onDeleted,
    children,
    widthClass,
    align,
}) {
    const id = article?.id;
    const slug = article?.slug;
    const qc = useQueryClient();
    const router = useRouter();

    const { user, loading: userLoading } = useContext(UserContext);
    const { openAuth } = useAuthModal();
    const { isFollowing, toggle: toggleFollow } = useFollow(
        isOwner ? undefined : article?.authorId,
    );

    const [shareOpen, setShareOpen] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);

    const articleUrl = getArticleUrl(slug);

    const requireAuth = (action) => {
        if (!user) {
            openAuth("login");
            return false;
        }
        return true;
    };

    const handleEdit = () => router.push(`/edit/${slug}`);

    const handleCopy = () => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(articleUrl).then(() => {
                toast.success("تم نسخ الرابط");
            });
        }
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

    const deleteMutation = useMutation({
        mutationFn: () => deleteArticle(id),
        onSuccess: () => {
            qc.setQueriesData(
                { queryKey: queryKeys.allArticles() },
                (data) => filterArticle(data, id),
            );
            for (const prefix of LIBRARY_KEYS) {
                qc.invalidateQueries({ queryKey: [prefix] });
            }
            setRemoveOpen(false);
            toast.success("تم حذف المقال");
            onDeleted?.();
        },
        onError: (err) => {
            toast.error(err?.message || "حدث خطأ أثناء حذف المقال");
        },
    });

    const neutralOptions = [
        { icon: Share2, label: "مشاركة المقال", onClick: () => setShareOpen(true) },
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

    return (
        <>
            <MoreMenu options={cleanOptions(options)} widthClass={widthClass} align={align}>
                {children}
            </MoreMenu>

            <ConfirmModal
                isOpen={removeOpen}
                icon={Trash2}
                color="var(--color-error)"
                icoBackground="var(--color-error-light)"
                title="حذف المقال"
                description="هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء."
                buttonText="حذف"
                loading={deleteMutation.isPending}
                onCancel={() => setRemoveOpen(false)}
                onConfirm={() => deleteMutation.mutate()}
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
                url={articleUrl}
                heading="مشاركة المقال"
                subheading="القراءة أكثر إفادةً عندما نشاركها مع الآخرين"
            />
        </>
    );
}
