import { ArrowLeft, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function EditorHeader({
    setPublishModal,
    setConfirmModal,
    wordCount,
}) {
    const router = useRouter();

    return (
        <>
            <header
                style={{
                    height: 57,
                    background: "var(--color-white)",
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    zIndex: 60,
                    boxSizing: "border-box",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Button
                        onClick={() => {
                            setPublishModal(true);
                        }}
                        type="primary"
                        style={{ padding: "8px 20px" }}
                    >
                        التالي
                    </Button>
                    <button
                        className="text-mid hover:text-error"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 8,
                            borderRadius: 6,
                            transition: "color 0.15s",
                        }}
                        onClick={() => {
                            setConfirmModal(true);
                        }}
                    >
                        <Trash size={20} />
                    </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                        style={{
                            fontSize: 13,
                            color: "var(--color-mid)",
                            whiteSpace: "nowrap",
                            userSelect: "none",
                            background: "var(--color-bg)",
                            borderRadius: 99,
                            padding: "3px 10px",
                        }}
                    >
                        {wordCount} كلمة
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="text-mid hover:text-ink"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 15,
                            padding: "4px 6px",
                            borderRadius: 6,
                            marginBottom: 5,
                            transition: "color 0.15s",
                        }}
                    >
                        رجوع
                        <ArrowLeft size={20} />
                    </button>
                </div>
            </header>
        </>
    );
}
