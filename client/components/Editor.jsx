import { ArrowLeft, Settings } from "lucide-react";
import { useCurrentEditor } from "@tiptap/react";
import { useRouter } from "next/navigation";

export const EditorHeader = () => {
    const { editor } = useCurrentEditor();
    const router = useRouter();

    return (
        <header
            style={{
                height: 57,
                background: "var(--color-white)",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 24px",
                top: 0,
                position: "sticky",
                zIndex: 60,
                boxSizing: "border-box",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                    style={{
                        padding: "8px 20px",
                        borderRadius: 6,
                        border: "none",
                        background: "var(--color-accent)",
                        color: "var(--color-white)",
                        cursor: "pointer",
                        fontSize: 15,
                        fontWeight: 500,
                        transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                            "var(--color-accent-hover)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                            "var(--color-accent)")
                    }
                >
                    التالي
                </button>
                {/* <button
                    onClick={() => {
                        fetch("http://localhost:3000/api/content", {
                            method: "POST",
                            body: JSON.stringify(editor.getJSON()),
                        });
                    }}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        border: "1px solid var(--color-border)",
                        background: "transparent",
                        color: "var(--color-ink)",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 500,
                        transition:
                            "background-color 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                            "var(--color-tag-bg)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                >
                    حفظ
                </button> */}
                <button
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--color-mid)",
                        padding: 8,
                        borderRadius: 6,
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-ink)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-mid)")
                    }
                >
                    <Settings size={20} />
                </button>
            </div>
            <button
                onClick={() => router.back()}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-mid)",
                    fontSize: 15,
                    padding: "4px 6px",
                    borderRadius: 6,
                    transition: "color 0.15s",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-ink)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--color-mid)")
                }
            >
                رجوع
                <ArrowLeft size={20} />
            </button>
        </header>
    );
};


