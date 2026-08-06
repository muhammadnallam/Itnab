"use client";
import { handleUser } from "@/lib/handlers";
import { redirect } from "next/navigation";
import { AuthForm, BrandBadge } from "@/components/AuthModal";
import { useState } from "react";

export default function Auth() {
    const [mode, setMode] = useState("login");
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
                <AuthForm
                    mode={mode}
                    onSwitchMode={() =>
                        setMode(mode === "login" ? "signup" : "login")
                    }
                    onSubmit={handleUser}
                    onClose={() => redirect("/")}
                />
            </div>
        </div>
    );
}
