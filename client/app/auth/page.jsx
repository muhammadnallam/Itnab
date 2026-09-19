"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    BrandBadge,
    LoginForm,
    SignupForm,
    VerifyOtpForm,
    ForgotPasswordForm,
} from "@/components/AuthModal";
import { safeRedirect } from "@/lib/handlers";

const RESENT_NOTICE = "البريد الإلكتروني غير مُتحقق. أرسلنا رمزًا جديدًا إلى بريدك.";
const MODES = ["login", "signup", "forgot"];

function AuthContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = safeRedirect(searchParams.get("redirect"));

    const requestedMode = searchParams.get("mode");
    const [mode, setMode] = useState(
        MODES.includes(requestedMode) ? requestedMode : "login",
    );
    const [verifyEmail, setVerifyEmail] = useState("");
    const [notice, setNotice] = useState("");

    const handleSuccess = (result) => {
        if (result?.needsVerification) {
            setVerifyEmail(result.email);
            setNotice(result.error ? RESENT_NOTICE : "");
            setMode("verify");
            return;
        }
        router.replace(redirect);
    };

    const switchMode = () => setMode(mode === "login" ? "signup" : "login");

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100dvh",
            }}
        >
            <div style={{ width: "100%", maxWidth: 400, padding: 24 }}>
                <BrandBadge />
                {mode === "login" && (
                    <LoginForm
                        onSwitchMode={switchMode}
                        onSuccess={handleSuccess}
                        onForgotPassword={() => setMode("forgot")}
                    />
                )}
                {mode === "signup" && (
                    <SignupForm
                        onSwitchMode={switchMode}
                        onSuccess={handleSuccess}
                    />
                )}
                {mode === "forgot" && (
                    <ForgotPasswordForm onBack={() => setMode("login")} />
                )}
                {mode === "verify" && (
                    <VerifyOtpForm
                        email={verifyEmail}
                        notice={notice}
                        onVerified={() => router.replace(redirect)}
                        onBack={() => {
                            setMode("login");
                            setNotice("");
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default function Auth() {
    return (
        <Suspense fallback={null}>
            <AuthContent />
        </Suspense>
    );
}
