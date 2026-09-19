"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandBadge } from "@/components/AuthModal";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/auth/PasswordInput";
import { handleResetPassword } from "@/lib/handlers";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const linkError = searchParams.get("error");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const invalidLink = linkError || !token;

    const validate = () => {
        const e = {};
        if (!password) e.password = "كلمة المرور مطلوبة";
        else if (password.length < 8)
            e.password = "كلمة المرور ضعيفة. استخدم 8 أحرف على الأقل";
        else if (password.length > 64)
            e.password = "كلمة المرور طويلة جدًا. يجب ألا تتجاوز 64 حرفًا";

        if (!confirmPassword) e.confirmPassword = "تأكيد كلمة المرور مطلوب";
        else if (password !== confirmPassword)
            e.confirmPassword = "كلمتا المرور غير متطابقتين";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError("");
        if (!validate()) return;
        setLoading(true);
        const result = await handleResetPassword(password, token);
        setLoading(false);
        if (!result.success) {
            setApiError(result.error);
            return;
        }
        setDone(true);
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100dvh",
            }}
        >
            <div style={{ width: "100%", maxWidth: 400, padding: 24 }}>
                <BrandBadge />
                <h2
                    style={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: "var(--color-ink)",
                        textAlign: "center",
                        marginBottom: 8,
                    }}
                >
                    إعادة تعيين كلمة المرور
                </h2>

                {invalidLink ? (
                    <>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--color-ink)",
                                textAlign: "center",
                                marginBottom: 24,
                                lineHeight: 1.7,
                            }}
                        >
                            رابط إعادة التعيين غير صالح أو منتهي الصلاحية.
                            الرابط صالح لمدة 15 دقيقة ولمرة واحدة فقط.
                        </p>
                        <Link
                            href="/auth?mode=forgot"
                            style={{
                                display: "block",
                                textAlign: "center",
                                fontSize: 13,
                                fontWeight: 700,
                                color: "var(--color-accent)",
                            }}
                        >
                            طلب رابط جديد
                        </Link>
                    </>
                ) : done ? (
                    <>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--color-ink)",
                                textAlign: "center",
                                marginBottom: 24,
                                lineHeight: 1.7,
                            }}
                        >
                            تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.
                        </p>
                        <Button
                            onClick={() => router.replace("/auth")}
                            style={{ width: "100%" }}
                        >
                            تسجيل الدخول
                        </Button>
                    </>
                ) : (
                    <>
                        <p
                            style={{
                                fontSize: 13,
                                color: "var(--color-ink)",
                                textAlign: "center",
                                marginBottom: 24,
                                lineHeight: 1.7,
                            }}
                        >
                            اختر كلمة مرور جديدة لحسابك.
                        </p>

                        {apiError && <p className="api-error">{apiError}</p>}

                        <form onSubmit={handleSubmit} noValidate>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                }}
                            >
                                <PasswordInput
                                    placeholder="كلمة المرور الجديدة"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrors((p) => ({
                                            ...p,
                                            password: "",
                                        }));
                                    }}
                                    autoComplete="new-password"
                                    minLength={8}
                                    error={errors.password}
                                />
                                <PasswordInput
                                    name="confirmPassword"
                                    placeholder="تأكيد كلمة المرور"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setErrors((p) => ({
                                            ...p,
                                            confirmPassword: "",
                                        }));
                                    }}
                                    autoComplete="new-password"
                                    minLength={8}
                                    error={errors.confirmPassword}
                                />
                            </div>
                            <div style={{ marginTop: 16 }}>
                                <Button
                                    loading={loading}
                                    style={{
                                        width: "100%",
                                        border: "1px solid var(--color-accent)",
                                    }}
                                >
                                    حفظ كلمة المرور
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordContent />
        </Suspense>
    );
}
