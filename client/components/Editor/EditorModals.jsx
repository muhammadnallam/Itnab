import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, Copy } from "lucide-react";
import { TAGS } from "@/components/constants";

const OVERLAY = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 16,
};

const MODAL = {
    background: "var(--color-white)",
    borderRadius: "var(--border-radius)",
    width: "100%",
    maxWidth: 520,
    maxHeight: "92vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 25px 70px rgba(0,0,0,0.12)",
};

const HEADER = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid var(--color-border)",
};

const TITLE = {
    margin: 0,
    fontSize: 18,
    fontWeight: 600,
    color: "var(--color-ink)",
};

const CLOSE_BTN = {
    background: "none",
    border: "none",
    padding: 4,
    margin: -4,
    color: "var(--color-ink)",
    cursor: "pointer",
    display: "flex",
    borderRadius: 6,
    opacity: 0.5,
};

const BODY = {
    overflowY: "auto",
    scrollbarGutter: "stable",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 24,
};

const SECTION = { display: "flex", flexDirection: "column", gap: 10 };

const SECTION_TITLE = {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "var(--color-ink)",
};

const OPTION_GROUP = { display: "flex", flexDirection: "column", gap: 10 };

const OPTION = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    color: "var(--color-ink)",
    cursor: "pointer",
};

const OPTION_RADIO = {
    width: 18,
    height: 18,
    accentColor: "var(--color-accent)",
    cursor: "pointer",
    flexShrink: 0,
};

const OPTION_DISABLED = { opacity: 0.45, cursor: "not-allowed" };

const HINT = {
    fontSize: 13,
    color: "var(--color-ink)",
    opacity: 0.8,
    marginTop: 2,
    lineHeight: 1.5,
};

const SELECT = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    fontSize: 14,
    color: "var(--color-ink)",
    background: "var(--color-white)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
};

const INPUT = {
    flex: 1,
    padding: "10px 14px",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    fontSize: 14,
    color: "var(--color-ink)",
    background: "var(--color-white)",
    outline: "none",
};

const INPUT_ROW = { display: "flex", gap: 8 };

const LINK_BOX = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    background: "var(--color-bg)",
};

const LINK_URL = {
    flex: 1,
    fontSize: 13,
    color: "var(--color-ink)",
    direction: "ltr",
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
};

const ICON_BTN = {
    background: "none",
    border: "none",
    padding: 4,
    color: "var(--color-ink)",
    opacity: 0.6,
    cursor: "pointer",
    display: "flex",
    borderRadius: 6,
};

const FOOTER = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 24px",
    borderTop: "1px solid var(--color-border)",
};

const BTN = {
    padding: "10px 18px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
};

const BTN_PRIMARY = {
    background: "var(--color-accent)",
    color: "var(--color-white)",
};

const BTN_SECONDARY = {
    background: "var(--color-bg)",
    color: "var(--color-ink)",
};

const BTN_DANGER = { background: "var(--color-error)", color: "#fff" };

const FILE_UPLOAD = {
    border: "2px dashed var(--color-border)",
    borderRadius: 8,
    padding: 40,
    textAlign: "center",
    cursor: "pointer",
    color: "var(--color-mid)",
    fontSize: 14,
    transition: "border-color 0.2s, background 0.2s",
    display: "block",
};

const FILE_PREVIEW = {
    width: "100%",
    aspectRatio: "191/100",
    objectFit: "cover",
    borderRadius: 8,
};

const TEXTAREA = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    fontSize: 14,
    color: "var(--color-ink)",
    background: "var(--color-white)",
    outline: "none",
    resize: "vertical",
    minHeight: 80,
    fontFamily: "inherit",
    lineHeight: 1.6,
    boxSizing: "border-box",
};

const ERROR_TEXT = {
    fontSize: 13,
    color: "var(--color-error)",
    marginTop: 6,
};

const TAG_WRAPPER = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
};

const TAG_CHIP = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "var(--color-mid)",
    background: "var(--color-tag-bg)",
    borderRadius: 99,
    padding: "4px 10px",
    whiteSpace: "nowrap",
};

const TAG_REMOVE = {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    color: "var(--color-mid)",
    display: "flex",
    opacity: 0.7,
};

const DROPDOWN_LIST = {
    position: "absolute",
    bottom: "100%",
    left: 0,
    right: 0,
    background: "var(--color-white)",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    marginBottom: 4,
    maxHeight: 200,
    overflowY: "auto",
    zIndex: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const DROPDOWN_ITEM = {
    width: "100%",
    padding: "10px 14px",
    border: "none",
    background: "none",
    fontSize: 14,
    color: "var(--color-ink)",
    textAlign: "right",
    cursor: "pointer",
    display: "block",
};

const COLLAPSIBLE = {
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    overflow: "hidden",
};

const COLLAPSIBLE_HEADER = {
    width: "100%",
    padding: "12px 16px",
    background: "none",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 14,
    fontWeight: 500,
    color: "var(--color-ink)",
    cursor: "pointer",
};

const COLLAPSIBLE_BODY = {
    padding: 16,
    borderTop: "1px solid var(--color-border)",
    fontSize: 14,
    color: "var(--color-ink)",
    opacity: 0.7,
    lineHeight: 1.6,
};

const RESET_LINK = {
    fontSize: 13,
    color: "var(--color-accent)",
    textDecoration: "underline",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
};

const DANGER_TITLE = {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--color-ink)",
    margin: "0 0 10px",
};

function ModalFrame({ isOpen, onClose, title, footer, children, onSubmit }) {
    if (!isOpen) return null;

    const bodyAndFooter = (
        <>
            <div style={BODY}>{children}</div>
            {footer && <div style={FOOTER}>{footer}</div>}
        </>
    );

    return (
        <div style={OVERLAY} onClick={onClose}>
            <div style={MODAL} onClick={(e) => e.stopPropagation()}>
                <div style={HEADER}>
                    <h2 style={TITLE}>{title}</h2>
                    <button
                        style={CLOSE_BTN}
                        onClick={onClose}
                        aria-label="إغلاق"
                    >
                        <X size={20} />
                    </button>
                </div>
                {onSubmit ? (
                    <form
                        onSubmit={onSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            flex: 1,
                        }}
                    >
                        {bodyAndFooter}
                    </form>
                ) : (
                    bodyAndFooter
                )}
            </div>
        </div>
    );
}

const COMMENT_OPTIONS = [
    { value: "everyone", label: "الجميع" },
    { value: "none", label: "لا أحد (تعطيل التعليقات)" },
];

function RadioGroup({ name, options, selected, onChange }) {
    return (
        <div style={OPTION_GROUP}>
            {options.map((opt) => (
                <label
                    key={opt.value}
                    style={{
                        ...OPTION,
                        ...(opt.disabled ? OPTION_DISABLED : {}),
                    }}
                >
                    <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={selected === opt.value}
                        onChange={onChange}
                        disabled={opt.disabled}
                        style={OPTION_RADIO}
                    />
                    <span>{opt.label}</span>
                </label>
            ))}
        </div>
    );
}

function TagPicker({ tags, selected, onAdd, onRemove, error }) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const filtered = tags.filter(
        (t) => t.includes(search) && !selected.includes(t),
    );

    useEffect(() => {
        function handleClick(e) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                inputRef.current &&
                !inputRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div style={{ position: "relative" }}>
            <input
                ref={inputRef}
                type="text"
                style={INPUT}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="ابحث عن وسم..."
            />
            {open && filtered.length > 0 && (
                <div ref={dropdownRef} style={DROPDOWN_LIST}>
                    {filtered.map((tag) => (
                        <button
                            key={tag}
                            style={DROPDOWN_ITEM}
                            onClick={() => {
                                onAdd(tag);
                                setSearch("");
                                setOpen(false);
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background =
                                    "var(--color-bg)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = "none")
                            }
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}
            {selected.length > 0 && (
                <div style={TAG_WRAPPER}>
                    {selected.map((tag) => (
                        <span key={tag} style={TAG_CHIP}>
                            {tag}
                            <button
                                style={TAG_REMOVE}
                                onClick={() => onRemove(tag)}
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
            {error && <p style={ERROR_TEXT}>{error}</p>}
        </div>
    );
}

export function PublishModal({ isOpen, onClose, onPublish, coverImage, setCoverImage, coverError, setCoverError }) {
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDescription, setSeoDescription] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagError, setTagError] = useState("");
    const [sendEmail, setSendEmail] = useState(true);

    return (
        <ModalFrame
            isOpen={isOpen}
            onClose={onClose}
            title="نشر"
            footer={
                <>
                    <button
                        type="submit"
                        style={{ ...BTN, ...BTN_PRIMARY }}
                    >
                        نشر المقال
                    </button>
                    <button style={{ ...BTN, ...BTN_DANGER }} onClick={onClose}>
                        حذف المقال
                    </button>
                </>
            }
            onSubmit={(e) => { e.preventDefault(); /* TODO: Submit Modals */ }}
        >
            <div style={SECTION}>
                <h3 style={SECTION_TITLE}>صورة الغلاف</h3>
                <label style={FILE_UPLOAD}>
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 3 * 1024 * 1024) {
                                setCoverError("الحد الأقصى 3 ميغابايت");
                                return;
                            }
                            setCoverError("");
                            setCoverImage(file);
                        }}
                    />
                    {coverImage ? (
                        <img
                            src={URL.createObjectURL(coverImage)}
                            alt=""
                            style={FILE_PREVIEW}
                        />
                    ) : (
                        <span style={{ color: "var(--color-mid)" }}>
                            انقر لاختيار صورة (3MB, 1.91:1)
                        </span>
                    )}
                </label>
                {coverError && <p style={ERROR_TEXT}>{coverError}</p>}
            </div>

            <div style={SECTION}>
                <h3 style={SECTION_TITLE}>عنوان SEO</h3>
                <input
                    type="text"
                    style={INPUT}
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="أدخل عنوان تحسين محركات البحث"
                />
            </div>

            <div style={SECTION}>
                <h3 style={SECTION_TITLE}>وصف SEO</h3>
                <textarea
                    style={TEXTAREA}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="أدخل وصف تحسين محركات البحث"
                />
            </div>

            <div style={SECTION}>
                <h3 style={SECTION_TITLE}>اختر الوسوم (3 كحد أقصى)</h3>
                <TagPicker
                    tags={TAGS}
                    selected={selectedTags}
                    onAdd={(tag) => {
                        if (selectedTags.length >= 3) {
                            setTagError("يمكنك اختيار 3 وسوم كحد أقصى");
                            return;
                        }
                        setTagError("");
                        setSelectedTags([...selectedTags, tag]);
                    }}
                    onRemove={(tag) =>
                        setSelectedTags(selectedTags.filter((t) => t !== tag))
                    }
                    error={tagError}
                />
            </div>

            <div style={SECTION}>
                <label style={OPTION}>
                    <input
                        type="checkbox"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        style={OPTION_RADIO}
                    />
                    <span>
                        إرسال المقال عبر البريد الإلكتروني إلى جميع المشتركين
                    </span>
                </label>
            </div>
        </ModalFrame>
    );
}

export function SettingsModal({ isOpen, onClose, onSave }) {
    const [commentsFrom, setCommentsFrom] = useState("everyone");
    const [testEmail, setTestEmail] = useState("itsmohamed@proton.me");

    return (
        <ModalFrame
            isOpen={isOpen}
            onClose={onClose}
            title="إعدادات المنشور"
            footer={
                <button type="submit" style={{ ...BTN, ...BTN_PRIMARY }}>
                    تم
                </button>
            }
            onSubmit={(e) => { e.preventDefault(); /* TODO: Submit Modals */ }}
        >
            <div style={SECTION}>
                <h3 style={SECTION_TITLE}>السماح بالتعليقات من...</h3>
                <RadioGroup
                    name="postComments"
                    options={COMMENT_OPTIONS}
                    selected={commentsFrom}
                    onChange={(e) => setCommentsFrom(e.target.value)}
                />
            </div>

            <div style={SECTION}>
                <h3 style={SECTION_TITLE}>إرسال بريد تجريبي</h3>
                <div style={INPUT_ROW}>
                    <input
                        type="email"
                        style={INPUT}
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="أدخل البريد الإلكتروني"
                    />
                    <button style={{ ...BTN, ...BTN_PRIMARY }}>إرسال</button>
                </div>
            </div>

            <div style={SECTION}>
                <h3 style={SECTION_TITLE}>رابط المسودة السرية</h3>
                <div style={LINK_BOX}>
                    <span style={LINK_URL}>
                        https://mohamedarchive.substack.com/p/863fd1a9-b573-486a-a6ef-
                    </span>
                    <button style={ICON_BTN} aria-label="نسخ الرابط">
                        <Copy size={16} />
                    </button>
                </div>
                <p style={HINT}>
                    يمكن لأي شخص عرض مسودتك باستخدام هذا الرابط، حتى لو لم يتم
                    نشرها.{" "}
                    <button style={RESET_LINK}>إعادة تعيين الرابط</button>
                </p>
            </div>

            <div style={SECTION}>
                <h3 style={DANGER_TITLE}>منطقة الخطر</h3>
                <button style={{ ...BTN, ...BTN_DANGER }}>حذف المنشور</button>
            </div>
        </ModalFrame>
    );
}
