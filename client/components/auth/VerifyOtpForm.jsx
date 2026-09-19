"use client";
import { useContext, useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ApiMessage from "@/components/ui/ApiMessage";
import { UserContext } from "@/context/UserContext";
import { headingStyle } from "./styles";
import { handleResendOtp, handleVerifyOtp } from "@/lib/handlers";

export default function VerifyOtpForm({ email, onVerified, onBack, notice }) {
    const { setUser } = useContext(UserContext);
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(60);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setInfo("");
        if (otp.length !== 6) {
            setError("أدخل الرمز المكوّن من 6 أرقام");
            return;
        }
        setLoading(true);
        const result = await handleVerifyOtp(email, otp, setUser);
        setLoading(false);
        if (!result.success) {
            setError(result.error);
            return;
        }
        onVerified?.();
    };

    const handleResend = async () => {
        setError("");
        setInfo("");
        setResending(true);
        const result = await handleResendOtp(email);
        setResending(false);
        if (!result.success) {
            setError(result.error);
            return;
        }
        setCooldown(60);
        setInfo("تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني");
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 style={headingStyle}>تأكيد البريد الإلكتروني</h2>
            <p
                style={{
                    fontSize: 13,
                    color: "var(--color-ink)",
                    textAlign: "center",
                    marginBottom: 24,
                    lineHeight: 1.7,
                }}
            >
                أرسلنا رمزًا مكوّنًا من 6 أرقام إلى
                <br />
                <span style={{ direction: "ltr", display: "inline-block" }}>
                    {email}
                </span>
            </p>

            {notice && <ApiMessage error={false}>{notice}</ApiMessage>}
            {error && <p className="api-error">{error}</p>}
            {info && <ApiMessage error={false}>{info}</ApiMessage>}

            <Input
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setError("");
                }}
                autoFocus
                required
                style={{
                    direction: "ltr",
                    textAlign: "center",
                    letterSpacing: 8,
                    fontSize: 20,
                }}
            />

            <div style={{ marginTop: 16 }}>
                <Button
                    loading={loading}
                    style={{
                        width: "100%",
                        border: "1px solid var(--color-accent)",
                    }}
                >
                    تأكيد
                </Button>
            </div>

            <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending || cooldown > 0}
                    style={{
                        background: "none",
                        border: "none",
                        cursor:
                            resending || cooldown > 0
                                ? "not-allowed"
                                : "pointer",
                        fontSize: 13,
                        color: "var(--color-light-txt)",
                    }}
                >
                    {cooldown > 0
                        ? `إعادة الإرسال بعد ${cooldown} ثانية`
                        : "إعادة إرسال الرمز"}
                </button>
            </div>

            {onBack && (
                <div style={{ textAlign: "center", marginTop: 10 }}>
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-mid text-sm cursor-pointer hover:text-ink"
                    >
                        رجوع
                    </button>
                </div>
            )}
        </form>
    );
}
