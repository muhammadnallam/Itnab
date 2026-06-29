const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "'Noto Sans Arabic'",
                    "Cairo",
                    "Segoe UI",
                    ...defaultTheme.fontFamily.sans,
                ],
                serif: [
                    "Georgia",
                    "'Noto Serif Arabic'",
                    ...defaultTheme.fontFamily.serif,
                ],
            },
            colors: {
                accent: {
                    DEFAULT: "#3C2416",
                    hover: "#5a3820",
                    light: "#f5ede8",
                    med: "#7a4a32",
                    ring: "rgba(60,36,22,0.25)",
                },
                gold: "#C9A84C",
                navy: "#1B2D4F",
                surface: "#ffffff",
                bg: "#f9f9f9",
                "page-bg": "#e0e0e0",
                parchment: "#F7F4EE",
                ink: "#1A1A1A",
                mid: "#6b6b6b",
                light: "#9e9e9e",
                "tag-bg": "#f2ede9",
                "dark-card": "#1a1a1a",
                "dark-surface": "#2a2a2a",
                border: "#e8e8e8",
            },
        },
    },
    plugins: [],
};
