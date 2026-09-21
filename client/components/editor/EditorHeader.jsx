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
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { formatRelativeTime } from "@/lib/format-date";

function SaveStatus({ saveStatus, lastSavedAt, onRetrySave }) {
    const contentStyle = {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap",
    };

    if (saveStatus === "saving") {
        return (
            <span style={{ ...contentStyle, color: "var(--color-mid)" }}>
                <Loader2
                    size={14}
                    style={{ animation: "spin 0.8s linear infinite" }}
                />
                يحفظ…
            </span>
        );
    }

    if (saveStatus === "error") {
        return (
            <button
                onClick={onRetrySave}
                title="إعادة المحاولة"
                style={{
                    ...contentStyle,
                    color: "var(--color-error)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    fontSize: "inherit",
                    cursor: "pointer",
                }}
            >
                <AlertCircle size={14} />
                فشل الحفظ
            </button>
        );
    }

    return (
        <span
            title={lastSavedAt ? formatRelativeTime(lastSavedAt) : undefined}
            style={{
                ...contentStyle,
                color:
                    saveStatus === "saved"
                        ? "var(--color-success)"
                        : "var(--color-mid)",
            }}
        >
            <Check size={14} />
            تم الحفظ
        </span>
    );
}

function SavePill(props) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                fontSize: 13,
                whiteSpace: "nowrap",
                userSelect: "none",
                background: "var(--color-bg)",
                borderRadius: 99,
                padding: "3px 10px",
            }}
        >
            <SaveStatus {...props} />
        </div>
    );
}

function MobileStatusBar({ wordCount, saveStatus, lastSavedAt, onRetrySave }) {
    return (
        <div
            style={{
                position: "absolute",
                left: 12,
                bottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
                zIndex: 55,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 12px",
                borderRadius: 10,
                background: "var(--color-white)",
                border: "1px solid var(--color-border)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
                fontSize: 12,
                color: "var(--color-mid)",
                direction: "rtl",
                userSelect: "none",
                whiteSpace: "nowrap",
            }}
        >
            <span>{wordCount} كلمة</span>
            <span
                style={{
                    width: 1,
                    height: 14,
                    background: "var(--color-border)",
                }}
            />
            <SaveStatus
                saveStatus={saveStatus}
                lastSavedAt={lastSavedAt}
                onRetrySave={onRetrySave}
            />
        </div>
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
    const menuRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("keydown", handleKey);
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.removeEventListener("mousedown", handleClick);
        };
    }, [open]);

    return (
        <div ref={menuRef} style={{ position: "relative" }}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
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
            {open && (
                <>
                    <div
                        style={{ position: "fixed", inset: 0, zIndex: 79 }}
                        onClick={() => setOpen(false)}
                    />
                    <div
                        className="card drafts-dropdown"
                        style={{
                            zIndex: 80,
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                            overflow: "hidden",
                            padding: 6,
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
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOpen(false);
                                            onSelectDraft(draft.id);
                                        }}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            flex: 1,
                                            minWidth: 0,
                                            padding: "8px 10px",
                                            borderRadius: 6,
                                            cursor: "pointer",
                                            background: "none",
                                            border: "none",
                                            textAlign: "right",
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
                                                {draft.title ||
                                                    "مسودة بدون عنوان"}
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
                                    </button>
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
                                <div
                                    style={{
                                        height: 1,
                                        background: "var(--color-border)",
                                        margin: "6px 0",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        onNewDraft();
                                    }}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "8px 10px",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        background: "none",
                                        border: "none",
                                        fontSize: 14,
                                        color: "var(--color-ink)",
                                        textAlign: "right",
                                    }}
                                >
                                    مسودة جديدة
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default function EditorHeader({
    setPublishModal,
    setConfirmModal,
    wordCount,
    isUpdate,
    isMobile,
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
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {!isMobile && (
                        <SavePill
                            saveStatus={saveStatus}
                            lastSavedAt={lastSavedAt}
                            onRetrySave={onRetrySave}
                        />
                    )}
                    {!isMobile && (
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
                    )}
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
            {isMobile && (
                <MobileStatusBar
                    wordCount={wordCount}
                    saveStatus={saveStatus}
                    lastSavedAt={lastSavedAt}
                    onRetrySave={onRetrySave}
                />
            )}
        </>
    );
}
