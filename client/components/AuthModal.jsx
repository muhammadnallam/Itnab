"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import BrandBadge from "./auth/BrandBadge";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";

export { default as BrandBadge } from "./auth/BrandBadge";
export { default as LoginForm } from "./auth/LoginForm";
export { default as SignupForm } from "./auth/SignupForm";

export default function AuthModal({ open, onClose, defaultMode = "login" }) {
    const [mode, setMode] = useState(defaultMode);
    const router = useRouter();

    const [prevOpen, setPrevOpen] = useState(open);
    if (prevOpen !== open) {
        setPrevOpen(open);
        if (open) setMode(defaultMode);
    }

    const handleSuccess = (result) => {
        onClose?.();
        if (result?.needsVerification) {
            router.push(
                `/verify-email?email=${encodeURIComponent(result.email)}`,
            );
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <BrandBadge />
            {mode === "login" ? (
                <LoginForm
                    onSwitchMode={() => setMode("signup")}
                    onSuccess={handleSuccess}
                />
            ) : (
                <SignupForm
                    onSwitchMode={() => setMode("login")}
                    onSuccess={handleSuccess}
                />
            )}
        </Modal>
    );
}
