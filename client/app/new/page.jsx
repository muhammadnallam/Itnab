import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import "@/styles/_variables.scss";

export default async function Page() {
    const session = await authClient.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/auth");
    }

    return <SimpleEditor />;
}
