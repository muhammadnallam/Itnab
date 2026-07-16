import { useState, useEffect, useContext } from "react";
import { Eye, EyeOff, Bookmark } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import InputField from "./InputField";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { authClient } from "@/lib/auth-client";
import { textAlignIcons } from "./tiptap-ui/text-align-button";

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

const BrandBadge = () => (
    <div
        style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "var(--color-accent-light)",
            color: "var(--accent-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
        }}
    >
        <Bookmark
            size={20}
            fill="var(--color-accent)"
            stroke="var(--color-accent)"
        />
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
};

const iconBtnStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    color: "var(--color-mid)",
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

const AuthForm = ({ mode, onSwitchMode, onSubmit, onClose }) => {
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

    const handleGoogleSignIn = async () => {
        setLoading(true);
        const { error } = await authClient.signIn.social({
            provider: "google",
        });
        setLoading(false);
        if (error) {
            setApiError(error.message || "فشل تسجيل الدخول عبر Google");
        }
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
                    onClick={onSwitchMode}
                    style={linkBtnStyle}
                >
                    {copy.switchLink}
                </button>
            </p>

            {apiError && (
                <p
                    role="alert"
                    style={{
                        margin: "0 0 16px",
                        padding: "8px 12px",
                        fontSize: 13,
                        color: "var(--color-error)",
                        background: "var(--color-error-light)",
                        borderRadius: "var(--border-radius)",
                        textAlign: "center",
                    }}
                >
                    {apiError}
                </p>
            )}

            <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    width: "100%",
                    padding: "10px 16px",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--border-radius)",
                    background: loading
                        ? "var(--color-disabled-bg)"
                        : "var(--color-white)",
                    color: "var(--color-ink)",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: loading ? "wait" : "pointer",
                    transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                    if (!loading)
                        e.currentTarget.style.background = "var(--color-bg)";
                }}
                onMouseLeave={(e) => {
                    if (!loading)
                        e.currentTarget.style.background = "var(--color-white)";
                }}
            >
                <GoogleIcon />
                متابعة عبر Google
            </button>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    margin: "16px 0",
                }}
            >
                <div
                    style={{
                        flex: 1,
                        height: 1,
                        background: "var(--color-border)",
                    }}
                />
                <span
                    style={{
                        fontSize: 13,
                        color: "var(--color-mid)",
                        whiteSpace: "nowrap",
                    }}
                >
                    أو
                </span>
                <div
                    style={{
                        flex: 1,
                        height: 1,
                        background: "var(--color-border)",
                    }}
                />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <InputField
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
                <InputField
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
                            style={iconBtnStyle}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color =
                                    "var(--color-ink)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color =
                                    "var(--color-mid)")
                            }
                        >
                            {showPass ? (
                                <Eye size={16} />
                            ) : (
                                <EyeOff size={16} />
                            )}
                        </button>
                    }
                    style={{direction: "ltr", textAlign: "right"}}
                />
            </div>

            <div style={{ marginTop: 16 }}>
                <Button loading={loading} style={{ width: "100%" }}>
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

async function handleUser(mode, email, password, setUser) {
    try {
        if (mode === "login") {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });
            if (error) {
                return {
                    success: false,
                    error: error.message || "فشل تسجيل الدخول",
                };
            }
            const { data: session } = await authClient.getSession();
            if (session?.user) setUser(session.user);
            return { success: true };
        }

        const name = email.split("@")[0];
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
        });
        if (error) {
            return {
                success: false,
                error: error.message || "فشل إنشاء الحساب",
            };
        }
        if (data?.user) setUser(data.user);
        return { success: true };
    } catch {
        return {
            success: false,
            error: "حدث خطأ ما من جانبنا. يرجى المحاولة لاحقًا",
        };
    }
}

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
