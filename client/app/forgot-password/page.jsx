"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { BrandBadge } from "@/components/AuthModal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ApiMessage from "@/components/ui/ApiMessage";
import { EMAIL_RE } from "@/components/auth/styles";
import { handleRequestReset } from "@/lib/handlers";

function ForgotPasswordContent() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (!email.trim()) {
            setError("البريد الإلكتروني مطلوب");
            return;
        }
        if (!EMAIL_RE.test(email)) {
            setError("صيغة البريد الإلكتروني غير صحيحة. تأكد من كتابته بشكل صحيح");
            return;
        }
        setLoading(true);
        const result = await handleRequestReset(email.trim());
        setLoading(false);
        if (!result.success) {
            setError(result.error);
            return;
        }
        setSent(true);
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
                    استعادة كلمة المرور
                </h2>

                {sent ? (
                    <>
                        <ApiMessage error={false}>
                            إذا كان هذا البريد مسجلاً لدينا، فستصلك رسالة تحتوي
                            على رابط لإعادة تعيين كلمة المرور.
                        </ApiMessage>
                        <div style={{ textAlign: "center", marginTop: 8 }}>
                            <Link
                                href="/auth"
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "var(--color-accent)",
                                }}
                            >
                                العودة لتسجيل الدخول
                            </Link>
                        </div>
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
                            أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين
                            كلمة المرور.
                        </p>

                        {error && <p className="api-error">{error}</p>}

                        <form onSubmit={handleSubmit} noValidate>
                            <Input
                                name="email"
                                type="email"
                                placeholder="البريد الإلكتروني"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                autoFocus
                                required
                                autoComplete="email"
                            />
                            <div style={{ marginTop: 16 }}>
                                <Button
                                    loading={loading}
                                    style={{
                                        width: "100%",
                                        border: "1px solid var(--color-accent)",
                                    }}
                                >
                                    إرسال رابط الاستعادة
                                </Button>
                            </div>
                        </form>

                        <div style={{ textAlign: "center", marginTop: 16 }}>
                            <Link
                                href="/auth"
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "var(--color-accent)",
                                }}
                            >
                                العودة لتسجيل الدخول
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ForgotPasswordContent />
        </Suspense>
    );
}
