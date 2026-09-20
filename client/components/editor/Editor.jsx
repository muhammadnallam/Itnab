"use client";

import EditorHeader from "@/components/editor/EditorHeader";
import PublishModal from "@/components/editor/PublishModal";
import ConfirmModal from "@/components/ConfirmModal";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Placeholder, Selection } from "@tiptap/extensions";
import { CharacterCount } from "@tiptap/extensions";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import { QuranVerseNode } from "@/components/tiptap-node/quran-verse-node/quran-verse-node-extension";
import { ArticleTitle, ArticleDescription, hasContent } from "@itnab/tiptap";
import { ProtectedNodes } from "@/components/tiptap-extension/protected-nodes-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-node/quran-verse-node/quran-verse-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import {
    QuranVersePopover,
    QuranVerseToolbarContent,
    QuranVerseButton,
} from "@/components/tiptap-ui/quran-verse-popover";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import {
    ColorHighlightPopover,
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";
import { QuranIcon } from "@/components/tiptap-icons/quran-icon";

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useDrafts } from "@/hooks/useDrafts";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";
import { serializeDraftContent } from "@/lib/draft-content";
import { getDraft } from "@/lib/api/draft";

// --- Styles ---
import "./styles.scss";
import { Trash } from "lucide-react";
import CoverImage from "./CoverImageNode";
import { useArticle } from "@/hooks/useArticle";

const MainToolbarContent = ({
    onHighlighterClick,
    onLinkClick,
    onQuranClick,
    isMobile,
}) => {
    return (
        <>
            <Spacer />
            <ToolbarGroup>
                <UndoRedoButton action="redo" />
                <UndoRedoButton action="undo" />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <HeadingDropdownMenu modal={false} levels={[1, 2, 3]} />
                <ListDropdownMenu
                    modal={false}
                    types={["bulletList", "orderedList"]}
                />
                <BlockquoteButton />
                <CodeBlockButton />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />
                {!isMobile ? (
                    <ColorHighlightPopover />
                ) : (
                    <ColorHighlightPopoverButton onClick={onHighlighterClick} />
                )}
                {!isMobile ? (
                    <LinkPopover />
                ) : (
                    <LinkButton onClick={onLinkClick} />
                )}
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <TextAlignButton align="right" />
                <TextAlignButton align="center" />
                <TextAlignButton align="left" />
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup>
                <ImageUploadButton text="صورة" />
                {!isMobile ? (
                    <QuranVersePopover />
                ) : (
                    <QuranVerseButton onClick={onQuranClick} />
                )}
            </ToolbarGroup>
            <Spacer />
            {isMobile && <ToolbarSeparator />}
        </>
    );
};

const MOBILE_TOOLBAR_ICONS = {
    highlighter: HighlighterIcon,
    link: LinkIcon,
    quran: QuranIcon,
};

const MobileToolbarContent = ({ type, onBack }) => {
    const TypeIcon = MOBILE_TOOLBAR_ICONS[type];

    return (
        <>
            <ToolbarGroup>
                <Button variant="ghost" onClick={onBack}>
                    <ArrowLeftIcon className="tiptap-button-icon" />
                    {TypeIcon && (
                        <TypeIcon className="tiptap-button-icon" />
                    )}
                </Button>
            </ToolbarGroup>

            <ToolbarSeparator />

            {type === "highlighter" ? (
                <ColorHighlightPopoverContent />
            ) : type === "link" ? (
                <LinkContent />
            ) : (
                <div className="quran-toolbar-content">
                    <QuranVerseToolbarContent onClose={onBack} />
                </div>
            )}
        </>
    );
};

const EMPTY_DOC = {
    type: "doc",
    content: [
        { type: "articleTitle", content: [] },
        { type: "articleDescription", content: [] },
    ],
};

function normalizeDraftContent(content) {
    const next =
        content?.content && Array.isArray(content.content)
            ? { ...content, content: [...content.content] }
            : { ...EMPTY_DOC, content: [...EMPTY_DOC.content] };

    if (next.content[0]?.type !== "articleTitle") {
        next.content.splice(0, 0, { type: "articleTitle", content: [] });
    }
    if (next.content[1]?.type !== "articleDescription") {
        next.content.splice(1, 0, { type: "articleDescription", content: [] });
    }

    return next;
}

export function Editor({ articleContent, articleData, mode } = {}) {
    const isUpdate = mode === "update";
    const articleId = articleData?.id;
    const router = useRouter();
    const isMobile = useIsBreakpoint();
    const { remove } = useArticle(articleData?.slug);
    const [mobileView, setMobileView] = useState("main");
    const toolbarRef = useRef(null);
    const [publishModal, setPublishModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [coverImage, setCoverImage] = useState(
        isUpdate && articleData?.coverImage ? articleData.coverImage : null,
    );
    const [coverError, setCoverError] = useState("");
    const [stats, setStats] = useState({ words: 0, characters: 0 });

    const {
        drafts,
        isLoading: draftsLoading,
        createDraft,
        saveDraft,
        deleteDraft,
    } = useDrafts({ articleId });

    const [seoTitle, setSeoTitle] = useState(
        isUpdate && articleData?.seoTitle ? articleData.seoTitle : "",
    );
    const [seoDescription, setSeoDescription] = useState(
        isUpdate && articleData?.seoDescription
            ? articleData.seoDescription
            : "",
    );
    const [tag, setTag] = useState(
        isUpdate && articleData?.tag ? articleData.tag : "",
    );

    const [activeDraftId, setActiveDraftId] = useState(null);
    const [saveStatus, setSaveStatus] = useState("idle");
    const [lastSavedAt, setLastSavedAt] = useState(null);
    const [resumePrompt, setResumePrompt] = useState(null);

    const editorRef = useRef(null);
    const saveDraftRef = useRef(saveDraft);
    const createDraftRef = useRef(createDraft);
    const deleteDraftRef = useRef(deleteDraft);
    const activeDraftIdRef = useRef(null);
    const metaRef = useRef({ seoTitle, seoDescription, tag });
    const savingRef = useRef(false);
    const queuedRef = useRef(false);
    const draftPromptHandledRef = useRef(false);
    const autoLoadedDraftRef = useRef(false);
    const hasUserEditedRef = useRef(false);
    const metaSkipRef = useRef(true);

    const applyMeta = ({
        seoTitle: nextTitle,
        seoDescription: nextDesc,
        tag: nextTag,
    }) => {
        if (
            nextTitle !== metaRef.current.seoTitle ||
            nextDesc !== metaRef.current.seoDescription ||
            nextTag !== metaRef.current.tag
        ) {
            metaSkipRef.current = true;
        }
        setSeoTitle(nextTitle);
        setSeoDescription(nextDesc);
        setTag(nextTag);
    };

    const doSave = useCallback(async () => {
        if (!editorRef.current) return;
        if (savingRef.current) {
            queuedRef.current = true;
            return;
        }
        savingRef.current = true;
        setSaveStatus("saving");

        try {
            do {
                queuedRef.current = false;
                const content = serializeDraftContent(
                    editorRef.current.getJSON(),
                );

                if (!hasContent(content)) {
                    if (activeDraftIdRef.current) {
                        const emptyDraftId = activeDraftIdRef.current;
                        activeDraftIdRef.current = null;
                        setActiveDraftId(null);
                        try {
                            await deleteDraftRef.current.mutateAsync(
                                emptyDraftId,
                            );
                        } catch {}
                    }
                    setSaveStatus("idle");
                    setLastSavedAt(null);
                    return;
                }

                const payload = {
                    content,
                    seoTitle: metaRef.current.seoTitle || null,
                    seoDescription: metaRef.current.seoDescription || null,
                    topic: metaRef.current.tag || null,
                };

                if (activeDraftIdRef.current) {
                    await saveDraftRef.current.mutateAsync({
                        id: activeDraftIdRef.current,
                        ...payload,
                    });
                } else {
                    const d = await createDraftRef.current.mutateAsync({
                        ...payload,
                        articleId,
                    });
                    activeDraftIdRef.current = d.id;
                    setActiveDraftId(d.id);
                }
            } while (queuedRef.current);

            setSaveStatus("saved");
            setLastSavedAt(new Date());
        } catch {
            queuedRef.current = false;
            setSaveStatus("error");
        } finally {
            savingRef.current = false;
        }
    }, [articleId]);

    const debouncedSave = useDebouncedCallback(doSave, 4000);

    // Intentional mount-only init: editor content should not swap when async props arrive late.
    const initialContent = useMemo(() => {
        return isUpdate && articleContent ? articleContent : EMPTY_DOC;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const editor = useEditor({
        immediatelyRender: false,
        autofocus: true,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label":
                    "منطقة المحتوى الرئيسية، ابدأ الكتابة لإدخال النص.",
                class: "simple-editor",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            Placeholder.configure({
                showOnlyCurrent: false,
                placeholder: ({ node }) => {
                    if (node.type.name === "articleTitle")
                        return "عنوان المقال";
                    if (node.type.name === "articleDescription")
                        return "وصف المقال";
                    return "";
                },
            }),
            ProtectedNodes,
            ArticleTitle,
            ArticleDescription,
            HorizontalRule,
            TextAlign.configure({
                types: ["heading", "paragraph"],
                defaultAlignment: "right",
            }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Selection,
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
            QuranVerseNode,
            CharacterCount,
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            hasUserEditedRef.current = true;
            setStats({
                words: editor.storage.characterCount.words(),
            });
            setSaveStatus("saving");
            debouncedSave();
        },
    });

    useEffect(() => {
        editorRef.current = editor;
    }, [editor]);

    useEffect(() => {
        saveDraftRef.current = saveDraft;
        createDraftRef.current = createDraft;
        deleteDraftRef.current = deleteDraft;
    }, [saveDraft, createDraft, deleteDraft]);

    useEffect(() => {
        metaRef.current = { seoTitle, seoDescription, tag };
    }, [seoTitle, seoDescription, tag]);

    useEffect(() => {
        if (metaSkipRef.current) {
            metaSkipRef.current = false;
            return;
        }
        setSaveStatus("saving");
        debouncedSave();
    }, [seoTitle, seoDescription, tag, debouncedSave]);

    useEffect(() => {
        const flush = () => debouncedSave.flush();
        const onVisibility = () => {
            if (document.visibilityState === "hidden") flush();
        };

        window.addEventListener("blur", flush);
        window.addEventListener("pagehide", flush);
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            window.removeEventListener("blur", flush);
            window.removeEventListener("pagehide", flush);
            document.removeEventListener("visibilitychange", onVisibility);
            debouncedSave.flush();
        };
    }, [debouncedSave]);

    useEffect(() => {
        if (!isUpdate) return;
        if (draftPromptHandledRef.current) return;
        if (draftsLoading) return;
        draftPromptHandledRef.current = true;
        if (drafts?.[0]) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setResumePrompt(drafts[0]);
        }
    }, [isUpdate, drafts, draftsLoading]);

    const handleResumeDraft = async () => {
        if (!resumePrompt) return;
        try {
            const full = await getDraft(resumePrompt.id);
            const normalized = normalizeDraftContent(full.content);
            editorRef.current.commands.setContent(normalized, {
                emitUpdate: false,
            });
            setStats({
                words: editorRef.current.storage.characterCount.words(),
            });
            applyMeta({
                seoTitle: full.seoTitle || "",
                seoDescription: full.seoDescription || "",
                tag: full.topic || "",
            });
            activeDraftIdRef.current = full.id;
            setActiveDraftId(full.id);
            setResumePrompt(null);
        } catch (err) {
            toast.error(err?.message || "تعذر استئناف المسودة");
        }
    };

    const handleIgnoreResume = () => {
        if (!resumePrompt) return;
        activeDraftIdRef.current = resumePrompt.id;
        setActiveDraftId(resumePrompt.id);
        setResumePrompt(null);
    };

    const handleSelectDraft = async (id) => {
        debouncedSave.flush();
        try {
            const full = await getDraft(id);
            const normalized = normalizeDraftContent(full.content);
            editorRef.current
                .chain()
                .focus()
                .setContent(normalized, { emitUpdate: false })
                .run();
            setStats({
                words: editorRef.current.storage.characterCount.words(),
            });
            applyMeta({
                seoTitle: full.seoTitle || "",
                seoDescription: full.seoDescription || "",
                tag: full.topic || "",
            });
            activeDraftIdRef.current = full.id;
            setActiveDraftId(full.id);
            setSaveStatus("saved");
            setLastSavedAt(full.updatedAt ? new Date(full.updatedAt) : new Date());
        } catch (err) {
            toast.error(err?.message || "تعذر فتح المسودة");
        }
    };

    useEffect(() => {
        if (isUpdate) return;
        if (draftsLoading) return;
        if (autoLoadedDraftRef.current) return;
        if (!editorRef.current) return;
        autoLoadedDraftRef.current = true;
        if (hasUserEditedRef.current) return;
        const last = drafts?.[0];
        if (last) handleSelectDraft(last.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUpdate, drafts, draftsLoading, editor]);

    const handleNewDraft = () => {
        debouncedSave.flush();
        editorRef.current
            .chain()
            .focus()
            .setContent(EMPTY_DOC, { emitUpdate: false })
            .run();
        setStats({ words: 0 });
        applyMeta({ seoTitle: "", seoDescription: "", tag: "" });
        activeDraftIdRef.current = null;
        setActiveDraftId(null);
        setSaveStatus("idle");
        setLastSavedAt(null);
    };

    const handleDeleteDraft = async (id) => {
        try {
            await deleteDraft.mutateAsync(id);
            if (activeDraftIdRef.current === id) {
                activeDraftIdRef.current = null;
                setActiveDraftId(null);
            }
            toast.success("تم حذف المسودة");
        } catch (err) {
            toast.error(err?.message || "تعذر حذف المسودة");
        }
    };

    const handleClear = () => {
        if (!editor) return;
        editor.chain()
            .focus()
            .setContent(EMPTY_DOC, { emitUpdate: false })
            .run();
        setStats({ words: 0 });
        applyMeta({ seoTitle: "", seoDescription: "", tag: "" });
        const draftId = activeDraftIdRef.current;
        activeDraftIdRef.current = null;
        setActiveDraftId(null);
        setSaveStatus("idle");
        setLastSavedAt(null);
        if (draftId) {
            deleteDraft.mutateAsync(draftId).catch(() => {});
        }
    };

    const onRetrySave = () => {
        setSaveStatus("saving");
        debouncedSave();
    };

    const [prevIsMobile, setPrevIsMobile] = useState(isMobile);
    if (prevIsMobile !== isMobile) {
        setPrevIsMobile(isMobile);
        if (!isMobile && mobileView !== "main") {
            setMobileView("main");
        }
    }

    return (
        <div className="simple-editor-wrapper">
            <EditorContext.Provider value={{ editor }}>
                <EditorHeader
                    setPublishModal={setPublishModal}
                    setConfirmModal={setConfirmModal}
                    wordCount={stats.words}
                    isUpdate={isUpdate}
                    onClear={handleClear}
                    drafts={drafts}
                    activeDraftId={activeDraftId}
                    saveStatus={saveStatus}
                    lastSavedAt={lastSavedAt}
                    onSelectDraft={handleSelectDraft}
                    onNewDraft={handleNewDraft}
                    onDeleteDraft={handleDeleteDraft}
                    onRetrySave={onRetrySave}
                />
                <PublishModal
                    isOpen={publishModal}
                    onClose={() => {
                        setPublishModal(false);
                    }}
                    coverImage={coverImage}
                    setCoverImage={setCoverImage}
                    coverError={coverError}
                    setCoverError={setCoverError}
                    content={editor && editor.getJSON()}
                    wordCount={stats.words}
                    mode={mode}
                    articleData={articleData}
                    seoTitle={seoTitle}
                    setSeoTitle={setSeoTitle}
                    seoDescription={seoDescription}
                    setSeoDescription={setSeoDescription}
                    tag={tag}
                    setTag={setTag}
                    onPublished={async () => {
                        if (activeDraftIdRef.current) {
                            await deleteDraft.mutateAsync(
                                activeDraftIdRef.current,
                            );
                            activeDraftIdRef.current = null;
                        }
                    }}
                />
                <ConfirmModal
                    isOpen={confirmModal}
                    icon={Trash}
                    color={"var(--color-error)"}
                    icoBackground={"#F5D5D8"}
                    title={"هل تريد حذف هذا المقال؟"}
                    description={"سيتم حذف هذا المقال ولن تستطيع إسترجاعه."}
                    buttonText={"حذف"}
                    onConfirm={async () => {
                        try {
                            await remove.mutateAsync(articleData.id);
                            toast.success("تم حذف المقال");
                            router.push("/");
                        } catch (err) {
                            toast.error(err?.message || "حدث خطأ أثناء حذف المقال");
                        }
                    }}
                    onCancel={() => setConfirmModal(false)}
                />
                <Toolbar ref={toolbarRef}>
                    {mobileView === "main" ? (
                        <MainToolbarContent
                            onHighlighterClick={() =>
                                setMobileView("highlighter")
                            }
                            onLinkClick={() => setMobileView("link")}
                            onQuranClick={() => setMobileView("quran")}
                            isMobile={isMobile}
                        />
                    ) : (
                        <MobileToolbarContent
                            type={mobileView}
                            onBack={() => setMobileView("main")}
                        />
                    )}
                </Toolbar>

                <div className="simple-editor-scroll">
                    {resumePrompt && (
                        <div
                            style={{
                                maxWidth: 740,
                                width: "calc(100% - 32px)",
                                margin: "16px auto 0",
                                padding: "12px 16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 12,
                                direction: "rtl",
                                background: "var(--color-white)",
                                border: "1px solid var(--color-border)",
                                borderRadius: 8,
                                boxSizing: "border-box",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 14,
                                    color: "var(--color-ink)",
                                }}
                            >
                                توجد مسودة غير منشورة
                            </span>
                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    onClick={handleResumeDraft}
                                    style={{
                                        background: "var(--color-accent)",
                                        color: "var(--color-white)",
                                        border: "none",
                                        borderRadius: 6,
                                        padding: "6px 14px",
                                        fontSize: 13,
                                        cursor: "pointer",
                                    }}
                                >
                                    استئناف
                                </button>
                                <button
                                    onClick={handleIgnoreResume}
                                    style={{
                                        background: "var(--color-bg)",
                                        color: "var(--color-ink)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: 6,
                                        padding: "6px 14px",
                                        fontSize: 13,
                                        cursor: "pointer",
                                    }}
                                >
                                    تجاهل
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="simple-editor-content">
                        <CoverImage
                            coverImage={coverImage}
                            setCoverError={setCoverError}
                            setCoverImage={setCoverImage}
                        />
                        <EditorContent editor={editor} role="presentation" />
                    </div>
                </div>
            </EditorContext.Provider>
        </div>
    );
}
