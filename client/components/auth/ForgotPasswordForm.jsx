"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ApiMessage from "@/components/ui/ApiMessage";
import { EMAIL_RE, headingStyle } from "./styles";
import { handleRequestReset } from "@/lib/handlers";

const backBtnStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--color-accent)",
};

function BackButton({ onClick }) {
    if (!onClick) return null;
    return (
        <div style={{ textAlign: "center", marginTop: 16 }}>
            <button type="button" onClick={onClick} style={backBtnStyle}>
                العودة لتسجيل الدخول
            </button>
        </div>
    );
}

export default function ForgotPasswordForm({ onBack }) {
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
            setError(
                "صيغة البريد الإلكتروني غير صحيحة. تأكد من كتابته بشكل صحيح",
            );
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
        <form onSubmit={handleSubmit} noValidate>
            <h2 style={headingStyle}>استعادة كلمة المرور</h2>

            {sent ? (
                <>
                    <ApiMessage error={false}>
                        إذا كان هذا البريد مسجلاً لدينا، فستصلك رسالة تحتوي على
                        رابط لإعادة تعيين كلمة المرور.
                    </ApiMessage>
                    <BackButton onClick={onBack} />
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
                        أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة
                        المرور.
                    </p>

                    {error && <p className="api-error">{error}</p>}

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

                    <BackButton onClick={onBack} />
                </>
            )}
        </form>
    );
}
