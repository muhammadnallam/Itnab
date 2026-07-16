import { createAuthClient } from "better-auth/react";
import { betterAuthLocalizationClientPlugin } from "better-auth-localization";

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [betterAuthLocalizationClientPlugin()],
});
