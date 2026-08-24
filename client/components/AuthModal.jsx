import { useState, useEffect, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import Input from "./ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { handleUser } from "@/lib/handlers";
import Image from "next/image";
import logo from "../public/logo.png";

export const BrandBadge = () => (
    <div
        style={{
            width: 48,
            height: 48,
            borderRadius: "var(--border-radius)",
            padding: 8,
            background: "var(--color-bg)",
            border: "1px solid var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
        }}
    >
        <Image src={logo} alt="itnab logo"></Image>
    </div>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const linkBtnStyle = {
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    color: "var(--color-ink)",
    textDecoration: "underline",
};

const iconBtnStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    transition: "color 0.15s",
};

const COPY = {
    login: {
        title: "أهلاً بعودتك",
        switchText: "أدخل بيانات الدخول أو",
        switchLink: "أنشئ حسابًا",
        submit: "تسجيل الدخول",
        genericError: "فشل تسجيل الدخول",
        autoComplete: "current-password",
        minLength: 6,
    },
    signup: {
        title: "إنشاء حساب جديد",
        switchText: "لديك حساب بالفعل؟",
        switchLink: "تسجيل الدخول",
        submit: "إنشاء الحساب",
        genericError: "فشل إنشاء الحساب",
        autoComplete: "new-password",
        minLength: 8,
    },
};

export const AuthForm = ({ mode, onSwitchMode, onSubmit, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const { setUser } = useContext(UserContext);
    const copy = COPY[mode];

    const validate = () => {
        const e = {};
        if (!email.trim()) e.email = "البريد الإلكتروني مطلوب";
        else if (!EMAIL_RE.test(email))
            e.email =
                "صيغة البريد الإلكتروني غير صحيحة. تأكد من كتابته بشكل صحيح";

        if (!password) e.password = "كلمة المرور مطلوبة";
        else if (password.length > 20)
            e.password = "كلمة المرور طويلة جدًا. يجب ألا تتجاوز 20 حرفًا";
        else if (password.length < 8)
            e.password = "كلمة المرور ضعيفة. استخدم 8 أحرف على الأقل";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;
        setLoading(true);
        const result = await onSubmit(mode, email.trim(), password, setUser);
        setLoading(false);
        if (!result.success) {
            setApiError(result.error || copy.genericError);
            return;
        }
        onClose?.();
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <h2
                style={{
                    fontSize: 19,
                    fontWeight: 700,
                    color: "var(--color-ink)",
                    textAlign: "center",
                    marginBottom: 8,
                }}
            >
                {copy.title}
            </h2>
            <p
                style={{
                    fontSize: 13,
                    color: "var(--color-ink)",
                    textAlign: "center",
                    marginBottom: 24,
                }}
            >
                {copy.switchText}{" "}
                <button
                    type="button"
                    onClick={() => {
                        onSwitchMode();
                        setApiError("");
                    }}
                    style={linkBtnStyle}
                >
                    {copy.switchLink}
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
                <Input
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="كلمة المرور"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((p) => ({ ...p, password: "" }));
                    }}
                    required
                    minLength={copy.minLength}
                    autoComplete={copy.autoComplete}
                    error={errors.password}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPass((s) => !s)}
                            className="text-mid hover:text-ink"
                            style={iconBtnStyle}
                        >
                            {showPass ? (
                                <Eye size={16} />
                            ) : (
                                <EyeOff size={16} />
                            )}
                        </button>
                    }
                    style={{ direction: "ltr", textAlign: "right" }}
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
                    {copy.submit}
                </Button>
            </div>

            {mode === "login" && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <button
                        type="button"
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
            )}
        </form>
    );
};

export default function AuthModal({
    open,
    onClose,
    defaultMode = "login",
    onSubmit = handleUser,
}) {
    const [mode, setMode] = useState(defaultMode);

    useEffect(() => {
        if (open) setMode(defaultMode);
    }, [open, defaultMode]);

    return (
        <Modal open={open} onClose={onClose}>
            <BrandBadge />
            <AuthForm
                mode={mode}
                onSwitchMode={() =>
                    setMode(mode === "login" ? "signup" : "login")
                }
                onSubmit={onSubmit}
                onClose={onClose}
            />
        </Modal>
    );
}
