"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PasswordInput from "./PasswordInput";
import { EMAIL_RE, headingStyle, linkBtnStyle, subTextStyle } from "./styles";
import { handleLogin } from "@/lib/handlers";

export default function LoginForm({ onSwitchMode, onSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const { setUser } = useContext(UserContext);
    const router = useRouter();

    const validate = () => {
        const e = {};
        if (!email.trim()) e.email = "البريد الإلكتروني مطلوب";
        else if (!EMAIL_RE.test(email))
            e.email =
                "صيغة البريد الإلكتروني غير صحيحة. تأكد من كتابته بشكل صحيح";

        if (!password) e.password = "كلمة المرور مطلوبة";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setApiError("");
        if (!validate()) return;
        setLoading(true);
        const result = await handleLogin(email.trim(), password, setUser);
        setLoading(false);
        if (!result.success) {
            setApiError(result.error || "فشل تسجيل الدخول");
            return;
        }
        onSuccess?.(result);
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2 style={headingStyle}>أهلاً بعودتك</h2>
            <p style={subTextStyle}>
                أدخل بيانات الدخول أو{" "}
                <button
                    type="button"
                    onClick={() => {
                        onSwitchMode();
                        setApiError("");
                    }}
                    style={linkBtnStyle}
                >
                    أنشئ حسابًا
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
                    autoComplete="current-password"
                    error={errors.password}
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
                    تسجيل الدخول
                </Button>
            </div>

            <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                    type="button"
                    onClick={() => router.push("/forgot-password")}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 13,
                        color: "var(--color-light-txt)",
                    }}
                >
                    نسيت كلمة المرور؟
                </button>
            </div>
        </form>
    );
}
