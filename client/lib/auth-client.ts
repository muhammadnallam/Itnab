import { createAuthClient } from "better-auth/react";
import { betterAuthLocalizationClientPlugin } from "better-auth-localization";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    plugins: [betterAuthLocalizationClientPlugin(), emailOTPClient()],
});
