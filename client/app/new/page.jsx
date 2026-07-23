import { Editor } from "@/components/editor/Editor";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import "@/styles/_variables.scss";

export default async function Page() {
    const { data: session } = await authClient.getSession({
        fetchOptions: {
            headers: await headers(),
        },
    });

    if (!session) {
        redirect("/auth");
    }

    return <Editor />;
}
