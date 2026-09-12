import { createAuthClient } from "better-auth/react";
import { betterAuthLocalizationClientPlugin } from "better-auth-localization";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
    plugins: [betterAuthLocalizationClientPlugin()],
});
