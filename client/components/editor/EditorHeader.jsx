import {
    AlertCircle,
    ArrowLeft,
    Check,
    ChevronDown,
    Eraser,
    Layers,
    Loader2,
    Trash,
} from "lucide-react";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { formatRelativeTime } from "@/lib/format-date";

function SavePill({ saveStatus, lastSavedAt, onRetrySave }) {
    const base = {
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13,
        whiteSpace: "nowrap",
        userSelect: "none",
        background: "var(--color-bg)",
        borderRadius: 99,
        padding: "3px 10px",
    };

    if (saveStatus === "saving") {
        return (
            <div style={{ ...base, color: "var(--color-mid)" }}>
                <Loader2
                    size={14}
                    style={{ animation: "spin 0.8s linear infinite" }}
                />
                جارٍ الحفظ…
            </div>
        );
    }

    if (saveStatus === "saved") {
        return (
            <div style={{ ...base, color: "var(--color-success)" }}>
                <Check size={14} />
                {`تم الحفظ${
                    lastSavedAt ? ` · ${formatRelativeTime(lastSavedAt)}` : ""
                }`}
            </div>
        );
    }

    if (saveStatus === "error") {
        return (
            <button
                onClick={onRetrySave}
                style={{
                    ...base,
                    color: "var(--color-error)",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                <AlertCircle size={14} />
                فشل الحفظ — إعادة المحاولة
            </button>
        );
    }

    return (
        <div style={{ ...base, color: "var(--color-mid)" }}>لا تغييرات</div>
    );
}

function DraftsMenu({
    drafts,
    activeDraftId,
    isUpdate,
    onSelectDraft,
    onNewDraft,
    onRequestDeleteDraft,
}) {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu.Root dir="rtl" open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    className="text-mid hover:text-ink"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "var(--color-bg)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        padding: "7px 12px",
                        cursor: "pointer",
                        fontSize: 14,
                        color: "var(--color-ink)",
                        whiteSpace: "nowrap",
                    }}
                >
                    <Layers size={18} />
                    المسودات
                    {drafts.length > 0 && (
                        <span
                            style={{
                                background: "var(--color-accent)",
                                color: "var(--color-white)",
                                borderRadius: 99,
                                fontSize: 11,
                                padding: "1px 6px",
                                lineHeight: 1.5,
                            }}
                        >
                            {drafts.length}
                        </span>
                    )}
                    <ChevronDown size={16} />
                </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="start"
                    sideOffset={6}
                    dir="rtl"
                    style={{
                        minWidth: 280,
                        direction: "rtl",
                        background: "var(--color-white)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 8,
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                        padding: 6,
                        zIndex: 100,
                    }}
                >
                    {drafts.length === 0 ? (
                        <div
                            style={{
                                padding: "10px 12px",
                                fontSize: 13,
                                color: "var(--color-mid)",
                            }}
                        >
                            لا توجد مسودات
                        </div>
                    ) : (
                        drafts.map((draft) => (
                            <div
                                key={draft.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: 6,
                                    background:
                                        draft.id === activeDraftId
                                            ? "var(--color-bg)"
                                            : "transparent",
                                }}
                            >
                                <DropdownMenu.Item
                                    onSelect={() => onSelectDraft(draft.id)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        flex: 1,
                                        minWidth: 0,
                                        padding: "8px 10px",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        outline: "none",
                                    }}
                                >
                                    <div
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            textAlign: "right",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 14,
                                                color: "var(--color-ink)",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {draft.title || "مسودة بدون عنوان"}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "var(--color-mid)",
                                                marginTop: 2,
                                            }}
                                        >
                                            {`${formatRelativeTime(
                                                draft.updatedAt,
                                            )} · ${draft.wordCount} كلمة`}
                                        </div>
                                    </div>
                                </DropdownMenu.Item>
                                <button
                                    type="button"
                                    aria-label="حذف المسودة"
                                    title="حذف المسودة"
                                    className="text-mid hover:text-error"
                                    onClick={() => {
                                        setOpen(false);
                                        onRequestDeleteDraft(draft);
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 8,
                                        borderRadius: 6,
                                        flexShrink: 0,
                                    }}
                                >
                                    <Trash size={15} />
                                </button>
                            </div>
                        ))
                    )}
                    {!isUpdate && (
                        <>
                            <DropdownMenu.Separator
                                style={{
                                    height: 1,
                                    background: "var(--color-border)",
                                    margin: "6px 0",
                                }}
                            />
                            <DropdownMenu.Item
                                onSelect={() => onNewDraft()}
                                style={{
                                    padding: "8px 10px",
                                    borderRadius: 6,
                                    cursor: "pointer",
                                    outline: "none",
                                    fontSize: 14,
                                    color: "var(--color-ink)",
                                    textAlign: "right",
                                }}
                            >
                                مسودة جديدة
                            </DropdownMenu.Item>
                        </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

export default function EditorHeader({
    setPublishModal,
    setConfirmModal,
    wordCount,
    isUpdate,
    onClear,
    drafts,
    activeDraftId,
    saveStatus,
    lastSavedAt,
    onSelectDraft,
    onNewDraft,
    onRequestDeleteDraft,
    onRetrySave,
}) {
    const router = useRouter();

    return (
        <>
            <header
                style={{
                    height: 57,
                    background: "var(--color-white)",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    zIndex: 60,
                    boxSizing: "border-box",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Button
                        onClick={() => {
                            setPublishModal(true);
                        }}
                        type="primary"
                        style={{ padding: "8px 20px" }}
                    >
                        التالي
                    </Button>
                    <DraftsMenu
                        drafts={drafts}
                        activeDraftId={activeDraftId}
                        isUpdate={isUpdate}
                        onSelectDraft={onSelectDraft}
                        onNewDraft={onNewDraft}
                        onRequestDeleteDraft={onRequestDeleteDraft}
                    />
                    <button
                        aria-label={isUpdate ? "حذف المقال" : "مسح المحتوى"}
                        title={isUpdate ? "حذف المقال" : "مسح المحتوى"}
                        className={
                            isUpdate
                                ? "text-mid hover:text-error"
                                : "text-mid hover:text-ink"
                        }
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 8,
                            borderRadius: 6,
                            transition: "color 0.15s",
                        }}
                        onClick={() => {
                            if (isUpdate) {
                                setConfirmModal(true);
                            } else {
                                onClear();
                            }
                        }}
                    >
                        {isUpdate ? <Trash size={20} /> : <Eraser size={20} />}
                    </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <SavePill
                        saveStatus={saveStatus}
                        lastSavedAt={lastSavedAt}
                        onRetrySave={onRetrySave}
                    />
                    <div
                        style={{
                            fontSize: 13,
                            color: "var(--color-mid)",
                            whiteSpace: "nowrap",
                            userSelect: "none",
                            background: "var(--color-bg)",
                            borderRadius: 99,
                            padding: "3px 10px",
                        }}
                    >
                        {wordCount} كلمة
                    </div>
                    <button
                        onClick={() => router.back()}
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
                            marginBottom: 5,
                            transition: "color 0.15s",
                        }}
                    >
                        رجوع
                        <ArrowLeft size={20} />
                    </button>
                </div>
            </header>
        </>
    );
}
