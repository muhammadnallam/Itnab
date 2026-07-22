"use client";

import EditorHeader from "@/components/editor/EditorHeader";
import PublishModal from "@/components/editor/PublishModal";
import ConfirmModal from "@/components/ConfirmModal";

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useDebouncedCallback } from "use-debounce";

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
import {
    ArticleTitle,
    ArticleDescription,
} from "@/components/tiptap-node/article-node/article-node-extension";
import { ProtectedNodes } from "@/components/tiptap-extension/protected-nodes-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
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

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "./styles.scss";
import { Trash } from "lucide-react";
import CoverImage from "./CoverImageNode";

const MainToolbarContent = ({ onHighlighterClick, onLinkClick, isMobile }) => {
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
            </ToolbarGroup>
            <Spacer />
            {isMobile && <ToolbarSeparator />}
        </>
    );
};

const MobileToolbarContent = ({ type, onBack }) => (
    <>
        <ToolbarGroup>
            <Button variant="ghost" onClick={onBack}>
                <ArrowLeftIcon className="tiptap-button-icon" />
                {type === "highlighter" ? (
                    <HighlighterIcon className="tiptap-button-icon" />
                ) : (
                    <LinkIcon className="tiptap-button-icon" />
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator />

        {type === "highlighter" ? (
            <ColorHighlightPopoverContent />
        ) : (
            <LinkContent />
        )}
    </>
);

export function Editor({ articleContent, articleData, mode } = {}) {
    const isUpdate = mode === "update";
    const isMobile = useIsBreakpoint();
    const [mobileView, setMobileView] = useState("main");
    const toolbarRef = useRef(null);
    const [publishModal, setPublishModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [coverImage, setCoverImage] = useState(
        isUpdate && articleData?.coverImage ? articleData.coverImage : null,
    );
    const [coverError, setCoverError] = useState("");
    const [stats, setStats] = useState({ words: 0, characters: 0 });

    const saveContent = useDebouncedCallback((content) => {
        if (!isUpdate) {
            window.localStorage.setItem(
                "editor-content",
                JSON.stringify(content),
            );
        }
    }, 2000);

    useEffect(() => {
        return () => {
            saveContent.flush();
        };
    }, [saveContent]);

    const initialContent = useMemo(() => {
        if (isUpdate && articleContent) {
            return articleContent;
        }
        if (typeof window !== "undefined") {
            const saved = window.localStorage.getItem("editor-content");
            if (saved && saved !== "{}" && saved !== "") {
                try {
                    const parsed = JSON.parse(saved);
                    if (
                        parsed?.content?.length > 0 &&
                        parsed.content[0]?.type !== "articleTitle"
                    ) {
                        parsed.content.unshift(
                            { type: "articleTitle", content: [] },
                            { type: "articleDescription", content: [] },
                        );
                    }
                    return parsed;
                } catch {}
            }
        }
        return {
            type: "doc",
            content: [
                { type: "articleTitle", content: [] },
                { type: "articleDescription", content: [] },
            ],
        };
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
            CharacterCount,
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            setStats({
                words: editor.storage.characterCount.words(),
            });
            saveContent(editor.getJSON());
        },
    });

    useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main");
        }
    }, [isMobile, mobileView]);

    useEffect(() => {
        if (editor) {
            setStats({
                words: editor.storage.characterCount.words(),
            });
        }
    }, [editor]);

    return (
        <div className="simple-editor-wrapper">
            <EditorContext.Provider value={{ editor }}>
                <EditorHeader
                    setPublishModal={setPublishModal}
                    setConfirmModal={setConfirmModal}
                    wordCount={stats.words}
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
                />
                <ConfirmModal
                    isOpen={confirmModal}
                    icon={Trash}
                    color={"var(--color-error)"}
                    icoBackground={"#F5D5D8"}
                    title={"هل تريد حذف هذا المقال؟"}
                    description={"سيتم حذف هذا المقال ولن تستطيع إسترجاعه."}
                    buttonText={"حذف"}
                    onCancel={() => setConfirmModal(false)}
                />
                <Toolbar ref={toolbarRef}>
                    {mobileView === "main" ? (
                        <MainToolbarContent
                            onHighlighterClick={() =>
                                setMobileView("highlighter")
                            }
                            onLinkClick={() => setMobileView("link")}
                            isMobile={isMobile}
                        />
                    ) : (
                        <MobileToolbarContent
                            type={
                                mobileView === "highlighter"
                                    ? "highlighter"
                                    : "link"
                            }
                            onBack={() => setMobileView("main")}
                        />
                    )}
                </Toolbar>

                <div className="simple-editor-scroll">
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
