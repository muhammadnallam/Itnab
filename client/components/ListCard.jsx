"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {
    Bookmark,
    Ellipsis,
    Pencil,
    Trash2,
    Share2,
    Copy,
    BookmarkPlus,
} from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import RequireAuth from "@/components/RequireAuth";
import ConfirmModal from "@/components/ConfirmModal";
import ShareModal from "@/components/ShareModal";
import MoreMenu from "@/components/MoreMenu";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { UserContext } from "@/context/UserContext";
import { useAuthModal } from "@/context/AuthModalContext";
import {
    useRenameList,
    useDeleteList,
    useSaveList,
    useUnsaveList,
} from "@/hooks/useLists";
import { toast } from "sonner";
import Link from "next/link";
import { BookmarkMinus } from "lucide-react";

export default function ListCard({ list, isMobile, isOwner: isOwnerProp }) {
    const [saved, setSaved] = useState(list.saved);
    const [removeOpen, setRemoveOpen] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [renameOpen, setRenameOpen] = useState(false);
    const [renameValue, setRenameValue] = useState(list.name);
    const [shareOpen, setShareOpen] = useState(false);

    const { user, loading: userLoading } = useContext(UserContext);
    const { openAuth } = useAuthModal();

    const renameMutation = useRenameList();
    const deleteMutation = useDeleteList();
    const saveListMutation = useSaveList();
    const unsaveListMutation = useUnsaveList();

    const isOwner =
        isOwnerProp ??
        (!userLoading &&
            Boolean(user) &&
            user.username === list.authorUsername);

    const imgWidths = isMobile ? [88, 60, 44] : [110, 76, 56];
    const cardHeight = isMobile ? 88 : 110;

    const listUrl = () =>
        typeof window !== "undefined"
            ? `${window.location.origin}/list/${list.id}`
            : "";

    const handleEditName = () => {
        setRenameValue(list.name);
        setRenameOpen(true);
    };

    const handleRename = () => {
        const trimmed = renameValue.trim();
        if (!trimmed) return;
        if (trimmed === list.name) {
            setRenameOpen(false);
            return;
        }
        renameMutation.mutate(
            { listId: list.id, name: trimmed },
            {
                onSuccess: () => {
                    setRenameOpen(false);
                    toast.success("تم تعديل اسم القائمة");
                },
                onError: (err) => {
                    toast.error(err?.message || "حدث خطأ أثناء تعديل الاسم");
                },
            },
        );
    };

    const handleShare = () => setShareOpen(true);

    const handleCopy = () => {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
            navigator.clipboard.writeText(listUrl()).then(() => {
                toast.success("تم نسخ الرابط");
            });
        }
    };

    const confirmRemove = async () => {
        try {
            setRemoving(true);
            await deleteMutation.mutateAsync(list.id);
            setRemoveOpen(false);
            toast.success("تم حذف القائمة");
        } catch (err) {
            toast.error(err?.message || "حدث خطأ أثناء حذف القائمة");
        } finally {
            setRemoving(false);
        }
    };

    const handleSaveList = () => {
        if (!user) {
            openAuth("login");
            return;
        }
        if (saved) {
            unsaveListMutation.mutate(list.id, {
                onSuccess: () => {
                    setSaved(false);
                    toast.success("تم إزالة القائمة من المحفوظات");
                },
                onError: (err) => {
                    toast.error(err?.message || "حدث خطأ");
                },
            });
        } else {
            saveListMutation.mutate(list.id, {
                onSuccess: () => {
                    setSaved(true);
                    toast.success("تم حفظ القائمة");
                },
                onError: (err) => {
                    toast.error(err?.message || "حدث خطأ");
                },
            });
        }
    };

    const ownerOptions = [
        { icon: Pencil, label: "تعديل اسم القائمة", onClick: handleEditName },
        { separator: true },
        { icon: Share2, label: "مشاركة القائمة", onClick: handleShare },
        { icon: Copy, label: "نسخ رابط القائمة", onClick: handleCopy },
        { separator: true },
        {
            icon: Trash2,
            label: "حذف القائمة",
            type: "red",
            onClick: () => setRemoveOpen(true),
        },
    ];

    const guestOptions = [
        {
            icon: saved ? BookmarkMinus : BookmarkPlus,
            label: saved ? "إزالة من المحفوظات" : "حفظ القائمة",
            onClick: handleSaveList,
            type: "red",
        },
        { separator: true },
        { icon: Share2, label: "مشاركة القائمة", onClick: handleShare },
        { icon: Copy, label: "نسخ رابط القائمة", onClick: handleCopy },
    ];

    const options = userLoading
        ? guestOptions
        : isOwner
          ? ownerOptions
          : guestOptions;

    return (
        <article
            style={{
                display: "flex",
                alignItems: "stretch",
                gap: 0,
                padding: "20px 0",
                borderBottom: "1px solid var(--color-border)",
                direction: "rtl",
            }}
        >
            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    paddingLeft: 16,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                        marginBottom: 10,
                    }}
                >
                    <Link
                        href={`/@${list.authorUsername}`}
                        className="flex items-center gap-2"
                    >
                        <Avatar
                            img={list.authorImage}
                            initials={list.ownerInitials}
                            size={20}
                            bg="var(--color-accent)"
                        />
                        <span
                            style={{
                                fontSize: 13,
                                color: "var(--color-ink)",
                                fontWeight: 500,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                            className="hover:underline"
                        >
                            {list.ownerName}
                        </span>
                    </Link>
                </div>

                {/* List title */}
                <Link href={listUrl()}>
                    <h3
                        style={{
                            fontSize: isMobile ? 16 : 18,
                            fontWeight: 700,
                            color: "var(--color-ink)",
                            lineHeight: 1.3,
                            margin: "0 0 8px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                        }}
                    >
                        {list.name}
                    </h3>
                </Link>

                {/* Actions row */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    {/* Article count */}
                    <p
                        style={{
                            fontSize: 13,
                            color: "var(--color-light)",
                        }}
                    >
                        {list.storyCount} مقالة
                    </p>
                    <div className="flex-1"></div>
                    {!isOwner && (
                        <RequireAuth>
                            <button
                                onClick={() => handleSaveList()}
                                className={`cursor-pointer pl-1 ${
                                    saved
                                        ? "text-accent"
                                        : "text-mid hover:text-accent"
                                }`}
                                style={{ transition: "color 0.15s" }}
                            >
                                <Bookmark
                                    size={19}
                                    fill={
                                        saved ? "var(--color-accent)" : "none"
                                    }
                                    color="currentColor"
                                />
                            </button>
                        </RequireAuth>
                    )}
                    {isOwner && (
                        <RequireAuth>
                            <button
                                onClick={() => setRemoveOpen(true)}
                                className={`cursor-pointer pl-1`}
                            >
                                <Trash2 size={19} color="var(--color-error)" />
                            </button>
                        </RequireAuth>
                    )}

                    <MoreMenu options={options}>
                        <Ellipsis size={19} style={{ marginLeft: 4 }} />
                    </MoreMenu>
                </div>
            </div>

            {/* ── Image strip (3 photos, descending widths) ─────────── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "stretch",
                    height: cardHeight,
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                {[0, 1, 2].map((i) => {
                    const src = list.images?.[i];
                    const w = imgWidths[i];

                    return (
                        <div
                            key={i}
                            style={{
                                width: w,
                                height: "100%",
                                flexShrink: 0,
                                background: src
                                    ? "var(--color-surface-subtle)"
                                    : "var(--color-white)",
                                borderRight:
                                    i > 0
                                        ? "2px solid var(--color-border)"
                                        : "none",
                                overflow: "hidden",
                            }}
                        >
                            {src && (
                                <img
                                    src={src}
                                    alt=""
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        display: "block",
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <ConfirmModal
                isOpen={removeOpen}
                icon={Trash2}
                color="var(--color-error)"
                icoBackground="var(--color-error-light)"
                title="حذف القائمة"
                description="هل أنت متأكد من حذف هذه القائمة؟ لا يمكن التراجع عن هذا الإجراء."
                buttonText="حذف"
                loading={removing}
                onCancel={() => setRemoveOpen(false)}
                onConfirm={confirmRemove}
            />

            <Modal open={renameOpen} onClose={() => setRenameOpen(false)}>
                <h2
                    style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--color-ink)",
                        margin: "0 0 16px",
                    }}
                >
                    تعديل اسم القائمة
                </h2>
                <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRename()}
                    maxLength={60}
                    autoFocus
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        fontSize: 15,
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--border-radius)",
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        justifyContent: "center",
                        marginTop: 20,
                    }}
                >
                    <Button
                        onClick={() => setRenameOpen(false)}
                        variant="secondary"
                        disabled={renameMutation.isPending}
                        style={{ width: "50%" }}
                    >
                        إلغاء
                    </Button>
                    <Button
                        onClick={handleRename}
                        loading={renameMutation.isPending}
                        style={{ width: "50%" }}
                    >
                        تحديث
                    </Button>
                </div>
            </Modal>

            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                articleId={list.id}
                url={listUrl()}
                heading="مشاركة القائمة"
                subheading="يمكنك مشاركة القائمة مع الآخرين"
            />
        </article>
    );
}
