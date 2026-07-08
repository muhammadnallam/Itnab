"use client";

// --- My Components
import EditorHeader from "@/components/Editor/EditorHeader";
import { PublishModal, SettingsModal } from "@/components/Editor/EditorModals";

import { useEffect, useRef, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Placeholder, Selection } from "@tiptap/extensions";

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
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

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

export function SimpleEditor() {
    const isMobile = useIsBreakpoint();
    const { height } = useWindowSize();
    const [mobileView, setMobileView] = useState("main");
    const toolbarRef = useRef(null);
    const [ publishModal, setPublishModal ] = useState(false);
    const [ settingsModal, setSettingsModal ] = useState(false);
    const [coverImage, setCoverImage] = useState(null);
    const [coverError, setCoverError] = useState("");

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
            /* TODO: use tiptap-extension-upload-image to upload to cloudinary, replace with a link, 
                     and show live preview upon success */
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
        ],
        content: (() => {
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
        })(),
        onUpdate: ({ editor }) => {
            window.localStorage.setItem(
                "editor-content",
                JSON.stringify(editor.getJSON()),
            );
        },
    });

    const rect = useCursorVisibility({
        editor,
        overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    });

    useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main");
        }
    }, [isMobile, mobileView]);

    return (
        <div className="simple-editor-wrapper">
            <EditorContext.Provider value={{ editor }}>
                <EditorHeader setPublishModal={setPublishModal} setSettingsModal={setSettingsModal}/>
                <PublishModal isOpen={publishModal} onClose={() => {setPublishModal(false)}}
                    coverImage={coverImage} setCoverImage={setCoverImage}
                    coverError={coverError} setCoverError={setCoverError}
                />
                <SettingsModal isOpen={settingsModal} onClose={() => {setSettingsModal(false)}}/>
                <Toolbar
                    ref={toolbarRef}
                    // style={{
                    //     ...(isMobile
                    //         ? {
                    //               bottom: `calc(100% - ${height - rect.y}px)`,
                    //           }
                    //         : {}),
                    // }}
                >
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

                <div className="simple-editor-content">
                    {coverImage && (
                        <div
                            style={{
                                padding: "3rem 3rem 24px",
                                maxWidth: "100%",
                                boxSizing: "border-box",
                            }}
                        >
                            <img
                                src={URL.createObjectURL(coverImage)}
                                alt=""
                                style={{
                                    width: "100%",
                                    aspectRatio: "191/100",
                                    objectFit: "cover",
                                    borderRadius: 8,
                                }}
                            />
                        </div>
                    )}
                    <label
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            padding: "12px 3rem",
                            cursor: "pointer",
                            fontSize: 13,
                            color: "var(--color-mid)",
                            borderBottom: "1px solid var(--color-border)",
                            margin: "0 3rem 0",
                            transition: "color 0.15s, border-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color =
                                "var(--color-accent)";
                            e.currentTarget.style.borderColor =
                                "var(--color-accent)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--color-mid)";
                            e.currentTarget.style.borderColor =
                                "var(--color-border)";
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 3 * 1024 * 1024) {
                                    setCoverError(
                                        "الحد الأقصى 3 ميغابايت",
                                    );
                                    return;
                                }
                                setCoverError("");
                                setCoverImage(file);
                            }}
                        />
                        {coverImage
                            ? "تغيير صورة الغلاف"
                            : "إضافة صورة غلاف"}
                    </label>
                    <EditorContent
                        editor={editor}
                        role="presentation"
                    />
                </div>
            </EditorContext.Provider>
        </div>
    );
}
