import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
    ...nextVitals,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
    {
        rules: {
            // Project uses plain <img> for simplicity; next/image opt-in is not desired.
            "@next/next/no-img-element": "off",
            // Fonts are loaded per-page via App Router; _document rule is inapplicable.
            "@next/next/no-page-custom-font": "off",
        },
    },
]);

export default eslintConfig;
