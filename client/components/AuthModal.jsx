"use client";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import BrandBadge from "./auth/BrandBadge";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";
import VerifyOtpForm from "./auth/VerifyOtpForm";
import ForgotPasswordForm from "./auth/ForgotPasswordForm";

export { default as BrandBadge } from "./auth/BrandBadge";
export { default as LoginForm } from "./auth/LoginForm";
export { default as SignupForm } from "./auth/SignupForm";
export { default as VerifyOtpForm } from "./auth/VerifyOtpForm";
export { default as ForgotPasswordForm } from "./auth/ForgotPasswordForm";

const RESENT_NOTICE = "البريد الإلكتروني غير مُتحقق. أرسلنا رمزًا جديدًا إلى بريدك.";

export default function AuthModal({ open, onClose, defaultMode = "login" }) {
    const [mode, setMode] = useState(defaultMode);
    const [verifyEmail, setVerifyEmail] = useState("");
    const [notice, setNotice] = useState("");

    const [prevOpen, setPrevOpen] = useState(open);
    if (prevOpen !== open) {
        setPrevOpen(open);
        if (open) {
            setMode(defaultMode);
            setVerifyEmail("");
            setNotice("");
        }
    }

    const handleSuccess = (result) => {
        if (result?.needsVerification) {
            setVerifyEmail(result.email);
            setNotice(result.error ? RESENT_NOTICE : "");
            setMode("verify");
            return;
        }
        onClose?.();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <BrandBadge />
            {mode === "login" && (
                <LoginForm
                    onSwitchMode={() => setMode("signup")}
                    onSuccess={handleSuccess}
                    onForgotPassword={() => setMode("forgot")}
                />
            )}
            {mode === "signup" && (
                <SignupForm
                    onSwitchMode={() => setMode("login")}
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
                    onVerified={() => onClose?.()}
                    onBack={() => {
                        setMode("login");
                        setNotice("");
                    }}
                />
            )}
        </Modal>
    );
}
