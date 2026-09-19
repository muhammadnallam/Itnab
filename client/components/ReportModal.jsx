"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
    ARTICLE_REPORT_REASONS,
    PROFILE_REPORT_REASONS,
} from "@itnab/constants";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextareaField from "@/components/ui/TextareaField";
import { submitReport } from "@/lib/api/reports";

const MAX_DETAILS = 500;

const HEADINGS = {
    article: "الإبلاغ عن المقال",
    profile: "الإبلاغ عن المؤلف",
};

export default function ReportModal({
    open,
    onClose,
    targetType = "article",
    articleId,
    profileId,
}) {
    const reasons =
        targetType === "profile"
            ? PROFILE_REPORT_REASONS
            : ARTICLE_REPORT_REASONS;

    const [category, setCategory] = useState("");
    const [details, setDetails] = useState("");
    const [detailsError, setDetailsError] = useState("");
    const [prevOpen, setPrevOpen] = useState(open);

    if (open !== prevOpen) {
        setPrevOpen(open);
        if (open) {
            setCategory("");
            setDetails("");
            setDetailsError("");
        }
    }

    const selected = reasons.find((reason) => reason.id === category);
    const needsDetails = Boolean(selected?.requiresDetails);
    const canSubmit = Boolean(category);

    const mutation = useMutation({
        mutationFn: () =>
            submitReport({
                category,
                ...(needsDetails ? { details: details.trim() } : {}),
                ...(targetType === "profile" ? { profileId } : { articleId }),
            }),
        onSuccess: () => {
            toast.success("تم استلام بلاغك، شكرًا لك");
            onClose();
        },
        onError: (err) => {
            if (err?.info?.code === "ALREADY_REPORTED") {
                toast(err.message);
            } else {
                toast.error(err?.message || "تعذر إرسال البلاغ");
            }
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!canSubmit || mutation.isPending) return;

        if (needsDetails) {
            if (!details.trim()) {
                setDetailsError("يرجى كتابة سبب الإبلاغ");
                return;
            }
            if (details.length > MAX_DETAILS) {
                setDetailsError(`الحد الأقصى ${MAX_DETAILS} حرف`);
                return;
            }
        }

        setDetailsError("");
        mutation.mutate();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            ariaLabel={HEADINGS[targetType]}
            maxHeight="min(600px, 92vh)"
            header={
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: 18,
                            fontWeight: 600,
                            color: "var(--color-ink)",
                        }}
                    >
                        {HEADINGS[targetType]}
                    </h2>
                    <p
                        style={{
                            margin: 0,
                            fontSize: 13,
                            color: "var(--color-mid)",
                        }}
                    >
                        أخبرنا ما المشكلة؟
                    </p>
                </div>
            }
            onSubmit={handleSubmit}
            footer={
                <Button
                    type="submit"
                    loading={mutation.isPending}
                    disabled={!canSubmit}
                    style={{ width: "100%" }}
                >
                    إرسال البلاغ
                </Button>
            }
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    flexShrink: 0,
                }}
            >
                {reasons.map((reason) => {
                    const active = reason.id === category;
                    return (
                        <label
                            key={reason.id}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 12px",
                                border: `1px solid ${
                                    active
                                        ? "var(--color-accent)"
                                        : "var(--color-border)"
                                }`,
                                borderRadius: "var(--border-radius)",
                                cursor: "pointer",
                                fontSize: 14,
                                color: "var(--color-ink)",
                                background: active
                                    ? "var(--color-tag-bg)"
                                    : "transparent",
                            }}
                        >
                            <input
                                type="radio"
                                name="report-category"
                                value={reason.id}
                                checked={active}
                                onChange={() => setCategory(reason.id)}
                                style={{ accentColor: "var(--color-accent)" }}
                            />
                            {reason.label}
                        </label>
                    );
                })}
            </div>

            {needsDetails && (
                <TextareaField
                    value={details}
                    onChange={(e) => {
                        setDetails(e.target.value);
                        if (detailsError) setDetailsError("");
                    }}
                    placeholder="اكتب سبب الإبلاغ"
                    max={MAX_DETAILS}
                    minHeight={96}
                    error={detailsError}
                    rows={4}
                    style={{ flexShrink: 0 }}
                />
            )}
        </Modal>
    );
}
