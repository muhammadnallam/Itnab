import { useState } from "react";
import { TAGS } from "@itnab/constants";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextareaField from "@/components/ui/TextareaField";
import {
    validateArticleFields,
    prepareArticlePayload,
} from "@/lib/handlers";
import { useArticle } from "@/hooks/useArticle";
import { queryKeys } from "@/lib/query-keys";
import { countPlaceholderImages } from "@/lib/draft-content";
import { toast } from "sonner";

function Input({ label, error, children }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h3
                style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-ink)",
                }}
            >
                {label}
            </h3>
            {children}
            {error && (
                <p
                    style={{
                        fontSize: 13,
                        color: "var(--color-error)",
                        marginTop: 6,
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export default function PublishModal({
    isOpen,
    onClose,
    coverImage,
    setCoverImage,
    coverError,
    setCoverError,
    content,
    wordCount,
    mode,
    articleData,
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    tag,
    setTag,
    onPublished,
}) {
    const isUpdate = mode === "update";
    const [seoTitleError, setSeoTitleError] = useState("");
    const [seoDescriptionError, setSeoDescriptionError] = useState("");
    const [tagError, setTagError] = useState("");
    const [sendEmail, setSendEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [placeholderAck, setPlaceholderAck] = useState(false);
    const router = useRouter();
    const qc = useQueryClient();
    const { publish, update } = useArticle(articleData?.slug);

    const placeholderCount = countPlaceholderImages(content);

    const handleClose = () => {
        setPlaceholderAck(false);
        onClose?.();
    };

    const inputBase = {
        width: "100%",
        padding: "10px 14px",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        fontSize: 14,
        color: "var(--color-ink)",
        background: "var(--color-white)",
        outline: "none",
        boxSizing: "border-box",
    };

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

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            header={isUpdate ? "تعديل" : "نشر"}
            footer={
                <>
                    <Button loading={loading} type="submit">
                        {isUpdate
                            ? "تعديل المقال"
                            : placeholderAck && placeholderCount > 0
                              ? "نشر على أي حال"
                              : "نشر المقال"}
                    </Button>
                    <Button onClick={handleClose} variant="secondary">
                        إلغاء
                    </Button>
                </>
            }
            onSubmit={async (e) => {
                e.preventDefault();
                setCoverError("");
                setSeoTitleError("");
                setSeoDescriptionError("");
                setTagError("");
                const payload = {
                    coverImage,
                    seoTitle,
                    seoDescription,
                    tag,
                    sendEmail,
                    content,
                    wordCount,
                };
                const errors = validateArticleFields(payload);
                if (errors.coverImage) setCoverError(errors.coverImage);
                if (errors.seoTitle) setSeoTitleError(errors.seoTitle);
                if (errors.seoDescription)
                    setSeoDescriptionError(errors.seoDescription);
                if (errors.tag) setTagError(errors.tag);
                if (errors.wordCount) toast.error(errors.wordCount);
                if (errors.articleTitle) toast.error(errors.articleTitle);
                if (errors.articleDescription)
                    toast.error(errors.articleDescription);
                if (Object.keys(errors).length > 0) return;

                if (placeholderCount > 0 && !placeholderAck) {
                    setPlaceholderAck(true);
                    return;
                }

                setLoading(true);
                try {
                    const prepared = await prepareArticlePayload(payload);
                    const mutation = isUpdate ? update : publish;
                    const result = await mutation.mutateAsync(
                        isUpdate
                            ? { ...prepared, articleId: articleData?.id }
                            : prepared,
                    );
                    if (isUpdate) {
                        toast.success("تم تحديث المقال");
                        qc.invalidateQueries({
                            queryKey: queryKeys.article(articleData?.slug),
                        });
                        router.refresh();
                        router.push(`/article/${articleData?.slug}`);
                    } else {
                        toast.success("تم نشر المقال");
                        router.push(`/article/${result.slug}`);
                    }
                    await onPublished?.();
                    handleClose();
                } catch (err) {
                    toast.error(err?.message || "حدث خطأ أثناء حفظ المقال");
                } finally {
                    setLoading(false);
                }
            }}
        >
            {placeholderAck && placeholderCount > 0 && (
                <div
                    style={{
                        background: "var(--color-error-light)",
                        border: "1px solid var(--color-error)",
                        borderRadius: 8,
                        padding: "12px 14px",
                        color: "var(--color-error)",
                        fontSize: 13,
                        lineHeight: 1.7,
                    }}
                >
                    تحتوي مسودتك على {placeholderCount} صورة نائبة لم يتم إعادة
                    إدراجها. سيتم حذفها عند النشر.
                    <div
                        style={{
                            marginTop: 4,
                            color: "var(--color-mid)",
                        }}
                    >
                        اضغط على زر النشر مرة أخرى للنشر على أي حال.
                    </div>
                </div>
            )}

            <Input label="صورة الغلاف" error={coverError}>
                <label style={FILE_UPLOAD}>
                    <input
                        name="image"
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
                            src={
                                typeof coverImage === "string"
                                    ? coverImage
                                    : URL.createObjectURL(coverImage)
                            }
                            alt=""
                            style={FILE_PREVIEW}
                        />
                    ) : (
                        <span style={{ color: "var(--color-mid)" }}>
                            انقر لاختيار صورة (3MB, 1.91:1)
                        </span>
                    )}
                </label>
            </Input>

            <Input label="عنوان محركات البحث" error={seoTitleError}>
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                    <input
                        name="title"
                        type="text"
                        style={{
                            ...inputBase,
                            ...(seoTitleError
                                ? { border: "1px solid var(--color-error)" }
                                : {}),
                        }}
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="أدخل عنوان تحسين محركات البحث"
                    />
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            fontSize: 12,
                            color:
                                seoTitle.length >= 30 && seoTitle.length <= 60
                                    ? "var(--color-success)"
                                    : "var(--color-error)",
                        }}
                    >
                        {seoTitle.length}/60
                    </div>
                </div>
            </Input>

            <TextareaField
                label="وصف محركات البحث"
                error={seoDescriptionError}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="أدخل وصف تحسين محركات البحث"
                min={100}
                max={160}
                minHeight={80}
                name="description"
            />

            <Input label="اختر الموضوع" error={tagError}>
                <select
                    name="tags"
                    style={{ ...inputBase, cursor: "pointer" }}
                    value={tag}
                    onChange={(e) => {
                        setTag(e.target.value);
                        setTagError("");
                    }}
                >
                    <option value="" disabled>
                        اختر موضوعًا
                    </option>
                    {TAGS.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </Input>
        </Modal>
    );
}
