"use client";
import { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PasswordInput from "./PasswordInput";
import { EMAIL_RE, headingStyle, linkBtnStyle, subTextStyle } from "./styles";
import { handleSignup } from "@/lib/handlers";

export default function SignupForm({ onSwitchMode, onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const { setUser } = useContext(UserContext);

    const validate = () => {
        const e = {};
        if (!email.trim()) e.email = "البريد الإلكتروني مطلوب";
        else if (!EMAIL_RE.test(email))
            e.email =
                "صيغة البريد الإلكتروني غير صحيحة. تأكد من كتابته بشكل صحيح";

        if (!password) e.password = "كلمة المرور مطلوبة";
        else if (password.length < 8)
            e.password = "كلمة المرور ضعيفة. استخدم 8 أحرف على الأقل";
        else if (password.length > 20)
            e.password = "كلمة المرور طويلة جدًا. يجب ألا تتجاوز 20 حرفًا";

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
        const result = await handleSignup(email.trim(), password, setUser);
        setLoading(false);
        if (!result.success) {
            setApiError(result.error || "فشل إنشاء الحساب");
            return;
        }
        onSuccess?.(result);
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 style={headingStyle}>إنشاء حساب جديد</h2>
            <p style={subTextStyle}>
                لديك حساب بالفعل؟{" "}
                <button
                    type="button"
                    onClick={() => {
                        onSwitchMode();
                        setApiError("");
                    }}
                    style={linkBtnStyle}
                >
                    تسجيل الدخول
                </button>
            </p>

            {apiError && <p className="api-error">{apiError}</p>}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Input
                    name="email"
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((p) => ({ ...p, email: "" }));
                    }}
                    autoFocus
                    required
                    autoComplete="email"
                    error={errors.email}
                />
                <PasswordInput
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((p) => ({ ...p, password: "" }));
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
                        setErrors((p) => ({ ...p, confirmPassword: "" }));
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
                    إنشاء الحساب
                </Button>
            </div>
        </form>
    );
}
