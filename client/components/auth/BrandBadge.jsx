import Image from "next/image";
import logo from "@/public/logo.png";

export default function BrandBadge() {
    return (
        <div
            style={{
                width: 48,
                height: 48,
                borderRadius: "var(--border-radius)",
                padding: 8,
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
            }}
        >
            <Image src={logo} alt="itnab logo" />
        </div>
    );
}
