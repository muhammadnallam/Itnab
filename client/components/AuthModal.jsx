import { useState, useEffect } from "react";
import { IcoClose, IcoEye, IcoEyeOff, IcoBack, BrandBadge } from "@/components/Icons";

const OVERLAY = "rgba(15,15,20,0.6)";

const InputField = ({
    type = "text",
    placeholder,
    value,
    onChange,
    rightIcon,
    autoFocus,
    name,
    id,
    required,
    minLength,
    autoComplete,
    error,
}) => {
    const inputId = id || name;
    const errId = inputId ? `${inputId}-error` : undefined;
    return (
        <div>
            <div style={{ position: "relative" }}>
                <input
                    type={type}
                    name={name}
                    id={inputId}
                    required={required}
                    minLength={minLength}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoFocus={autoFocus}
                    aria-invalid={!!error}
                    aria-describedby={error ? errId : undefined}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: rightIcon
                            ? "14px 44px 14px 16px"
                            : "14px 16px",
                        border: `1px solid ${error ? "var(--color-error)" : "var(--color-border)"}`,
                        borderRadius: 12,
                        fontSize: 14.5,
                        fontFamily: "inherit",
                        color: "var(--color-ink)",
                        background: "var(--color-white)",
                        outline: "none",
                        direction: "rtl",
                        transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => {
                        if (!error)
                            e.target.style.borderColor = "var(--color-accent)";
                    }}
                    onBlur={(e) => {
                        if (!error)
                            e.target.style.borderColor = "var(--color-border)";
                    }}
                />
                {rightIcon && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            right: 14,
                            transform: "translateY(-50%)",
                        }}
                    >
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p
                    id={errId}
                    role="alert"
                    style={{
                        margin: "6px 0 0",
                        fontSize: 12,
                        color: "var(--color-error)",
                        direction: "rtl",
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );
};

const PrimaryButton = ({
    children,
    enabled = true,
    loading = false,
    onClick,
}) => (
    <button
        onClick={enabled && !loading ? onClick : undefined}
        disabled={loading || !enabled}
        style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            fontSize: 14.5,
            fontWeight: 600,
            fontFamily: "inherit",
            background:
                enabled && !loading
                    ? "var(--color-accent)"
                    : "var(--color-disabled-bg)",
            color:
                enabled && !loading
                    ? "var(--color-white)"
                    : "var(--color-disabled-txt)",
            cursor: loading ? "wait" : enabled ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "background 0.2s, color 0.2s",
        }}
    >
        {loading ? (
            <span
                style={{
                    display: "inline-block",
                    width: 18,
                    height: 18,
                    border: "2px solid currentColor",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                }}
            />
        ) : (
            children
        )}
    </button>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LogInView = ({ onSwitchToRegister, onLogIn, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");

    const validate = () => {
        const e = {};
        if (!email.trim()) e.email = "البريد الإلكتروني مطلوب";
        else if (!EMAIL_RE.test(email)) e.email = "البريد الإلكتروني غير صالح";
        if (!password) e.password = "كلمة المرور مطلوبة";
        else if (password.length < 8) e.password = "كلمة المرور قصيرة جداً";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validate()) return;
        setLoading(true);
        const result = await onLogIn(email.trim(), password);
        setLoading(false);
        if (!result.success) {
            setApiError(result.error || "فشل تسجيل الدخول");
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
                    marginBottom: 6,
                }}
            >
                أهلاً بعودتك
            </h2>
            <p
                style={{
                    fontSize: 13.5,
                    color: "var(--color-ink)",
                    textAlign: "center",
                    marginBottom: 24,
                }}
            >
                أدخل بيانات الدخول أو{" "}
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: "var(--color-ink)",
                        fontFamily: "inherit",
                    }}
                >
                    أنشئ حسابًا
                </button>
            </p>

            {apiError && (
                <p
                    role="alert"
                    style={{
                        margin: "0 0 16px",
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "var(--color-white)",
                        background: "var(--color-error)",
                        borderRadius: 10,
                        textAlign: "center",
                    }}
                >
                    {apiError}
                </p>
            )}

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
                    minLength={6}
                    autoComplete="current-password"
                    error={errors.password}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPass((s) => !s)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                display: "flex",
                                color: "var(--color-mid)",
                            }}
                        >
                            {showPass ? (
                                <IcoEye size={17} />
                            ) : (
                                <IcoEyeOff size={17} />
                            )}
                        </button>
                    }
                />
            </div>

            <div style={{ marginTop: 16 }}>
                <PrimaryButton enabled={true} loading={loading}>
                    تسجيل الدخول
                </PrimaryButton>
            </div>

            <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                    type="button"
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 13,
                        color: "var(--color-light-txt)",
                        fontFamily: "inherit",
                    }}
                >
                    نسيت كلمة المرور؟
                </button>
            </div>
        </form>
    );
};

const RegisterView = ({ onSwitchToLogIn, onRegister, onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");

    const validateEmail = () => {
        const e = {};
        if (!email.trim()) e.email = "البريد الإلكتروني مطلوب";
        else if (!EMAIL_RE.test(email)) e.email = "البريد الإلكتروني غير صالح";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validatePassword = () => {
        const e = {};
        if (!password) e.password = "كلمة المرور مطلوبة";
        else if (password.length < 8) e.password = "الحد الأدنى 8 أحرف";
        else if (password.length > 20) e.password = "الحد الأقصى 20 حرفًا";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleEmail = (e) => {
        e.preventDefault();
        setApiError("");
        if (!validateEmail()) return;
        setStep(2);
    };

    const handlePassword = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!validatePassword()) return;
        setLoading(true);
        const result = await onRegister(email.trim(), password);
        setLoading(false);
        if (!result.success) {
            setApiError(result.error || "فشل إنشاء الحساب");
            return;
        }
        onClose?.();
    };

    return (
        <>
            <h2
                style={{
                    fontSize: 19,
                    fontWeight: 700,
                    color: "var(--color-ink)",
                    textAlign: "center",
                    marginBottom: 6,
                }}
            >
                إنشاء حساب جديد
            </h2>
            <p
                style={{
                    fontSize: 13.5,
                    color: "var(--color-mid)",
                    textAlign: "center",
                    marginBottom: 24,
                }}
            >
                {step === 1 ? (
                    <>
                        لديك حساب بالفعل؟{" "}
                        <button
                            type="button"
                            onClick={onSwitchToLogIn}
                            style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                fontSize: 13.5,
                                fontWeight: 700,
                                color: "var(--color-ink)",
                                fontFamily: "inherit",
                            }}
                        >
                            تسجيل الدخول
                        </button>
                    </>
                ) : (
                    "أضف كلمة مرور آمنة لحسابك"
                )}
            </p>

            {apiError && (
                <p
                    role="alert"
                    style={{
                        margin: "0 0 16px",
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "var(--color-white)",
                        background: "var(--color-error)",
                        borderRadius: 10,
                        textAlign: "center",
                    }}
                >
                    {apiError}
                </p>
            )}

            <div style={{ overflow: "hidden" }}>
                <div
                    style={{
                        display: "flex",
                        width: "200%",
                        transform: `translateX(${step === 1 ? "0%" : "50%"})`,
                        transition: "transform 0.35s ease",
                    }}
                >
                    <div
                        style={{
                            width: "50%",
                            boxSizing: "border-box",
                            paddingLeft: step === 1 ? 0 : 8,
                        }}
                    >
                        <form onSubmit={handleEmail} noValidate>
                            <InputField
                                name="email"
                                type="email"
                                placeholder="بريدك الإلكتروني"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrors((p) => ({ ...p, email: "" }));
                                }}
                                autoFocus={step === 1}
                                required
                                autoComplete="email"
                                error={errors.email}
                            />
                            <div style={{ marginTop: 16 }}>
                                <PrimaryButton enabled={true} loading={false}>
                                    متابعة
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    <div
                        style={{
                            width: "50%",
                            boxSizing: "border-box",
                            paddingRight: step === 2 ? 0 : 8,
                        }}
                    >
                        <form onSubmit={handlePassword} noValidate>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    marginBottom: 12,
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    style={{
                                        background: "none",
                                        border: `1px solid ${"var(--color-border)"}`,
                                        borderRadius: "50%",
                                        width: 32,
                                        height: 32,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        color: "var(--color-mid)",
                                        flexShrink: 0,
                                    }}
                                >
                                    <IcoBack size={15} />
                                </button>
                                <span
                                    style={{
                                        fontSize: 13,
                                        color: "var(--color-mid)",
                                        direction: "rtl",
                                    }}
                                >
                                    {email}
                                </span>
                            </div>
                            <InputField
                                name="password"
                                type={showPass ? "text" : "password"}
                                placeholder="كلمة المرور"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrors((p) => ({ ...p, password: "" }));
                                }}
                                autoFocus={step === 2}
                                required
                                minLength={8}
                                autoComplete="new-password"
                                error={errors.password}
                                rightIcon={
                                    <button
                                        type="button"
                                        onClick={() => setShowPass((s) => !s)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            display: "flex",
                                            color: "var(--color-mid)",
                                        }}
                                    >
                                        {showPass ? (
                                            <IcoEye size={17} />
                                        ) : (
                                            <IcoEyeOff size={17} />
                                        )}
                                    </button>
                                }
                            />
                            <div style={{ marginTop: 16 }}>
                                <PrimaryButton enabled={true} loading={loading}>
                                    إنشاء الحساب
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};



async function defaultLogIn(email, password) {
    try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success)
            return { success: false, error: data.error || "فشل تسجيل الدخول" };
        return { success: true, user: data.user };
    } catch {
        return { success: false, error: "تعذر الاتصال بالخادم" };
    }
}

async function defaultRegister(email, password) {
    try {
        const res = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success)
            return { success: false, error: data.error || "فشل إنشاء الحساب" };
        return { success: true, user: data.user };
    } catch {
        return { success: false, error: "تعذر الاتصال بالخادم" };
    }
}

export default function AuthModal({
    open,
    onClose,
    defaultMode = "signin",
    onLogIn = defaultLogIn,
    onRegister = defaultRegister,
}) {
    const [mode, setMode] = useState(defaultMode);

    useEffect(() => {
        if (open) setMode(defaultMode);
    }, [open, defaultMode]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                background: OVERLAY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 400,
                    background: "var(--color-white)",
                    borderRadius: 20,
                    padding: "28px 28px 30px",
                    direction: "rtl",
                    fontFamily:
                        "'Noto Sans Arabic', 'Cairo', 'Segoe UI', sans-serif",
                    boxShadow: "0 24px 70px rgba(15,15,20,0.35)",
                    animation: "authModalIn 0.18s ease",
                }}
            >
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 18,
                        left: 18,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-mid)",
                        display: "flex",
                        padding: 4,
                    }}
                >
                    <IcoClose size={18} />
                </button>

                <BrandBadge />

                {mode === "signin" ? (
                    <LogInView
                        onSwitchToRegister={() => setMode("signup")}
                        onLogIn={onLogIn}
                        onClose={onClose}
                    />
                ) : (
                    <RegisterView
                        onSwitchToLogIn={() => setMode("signin")}
                        onRegister={onRegister}
                        onClose={onClose}
                    />
                )}
            </div>
            <style>{`
        @keyframes authModalIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
