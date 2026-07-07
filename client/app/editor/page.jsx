import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function Page() {
    return (
        <>
            {/* <header
                style={{
                    height: 57,
                    borderBottom: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "0 24px",
                }}
            >
                <button>نشر</button>
                <button>حفظ</button>
            </header> */}
            <SimpleEditor />
        </>
    );
}
