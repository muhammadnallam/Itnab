"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BrandBadge, LoginForm, SignupForm } from "@/components/AuthModal";
import { safeRedirect } from "@/lib/handlers";

function AuthContent() {
    const [mode, setMode] = useState("login");
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = safeRedirect(searchParams.get("redirect"));

    const handleSuccess = (result) => {
        if (result?.needsVerification) {
            router.replace(
                `/verify-email?email=${encodeURIComponent(result.email)}`,
            );
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
                {mode === "login" ? (
                    <LoginForm
                        onSwitchMode={switchMode}
                        onSuccess={handleSuccess}
                    />
                ) : (
                    <SignupForm
                        onSwitchMode={switchMode}
                        onSuccess={handleSuccess}
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
