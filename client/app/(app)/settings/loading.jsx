import PageContent from "@/components/PageContent";

export default function Loading() {
    return (
        <PageContent>
            <div
                style={{
                    height: 420,
                    borderRadius: "var(--border-radius)",
                    background: "var(--color-tag-bg)",
                    animation: "pulse 1.5s ease-in-out infinite",
                }}
            />
        </PageContent>
    );
}
