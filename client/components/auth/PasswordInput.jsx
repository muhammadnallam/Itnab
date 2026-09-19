"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";
import { iconBtnStyle } from "./styles";

export default function PasswordInput({
    name = "password",
    placeholder = "كلمة المرور",
    value,
    onChange,
    autoComplete,
    minLength,
    error,
}) {
    const [show, setShow] = useState(false);

    return (
        <Input
            name={name}
            type={show ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            minLength={minLength}
            error={error}
            rightIcon={
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    className="text-mid hover:text-ink"
                    style={iconBtnStyle}
                >
                    {show ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
            }
            style={{ direction: "ltr", textAlign: "right" }}
        />
    );
}
