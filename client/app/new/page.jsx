import { Editor } from "@/components/editor/Editor";
import "@/styles/_variables.scss";

export const metadata = {
    title: "كتابة مقال جديد",
    robots: { index: false, follow: false },
};

export default async function Page() {
    return <Editor />;
}
