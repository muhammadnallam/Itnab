import { StrictMode } from "react";
import "./globals.css";
import localFont from "next/font/local";
import UserProvider from "@/context/UserContext";

const nastaliqUrdu = localFont({
    src: [
        {
            path: "../public/fonts/NotoNastaliqUrdu-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../public/fonts/NotoNastaliqUrdu-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../public/fonts/NotoNastaliqUrdu-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../public/fonts/NotoNastaliqUrdu-Bold.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-wordmark",
});

export const metadata = {
    title: "إطناب",
    description: "نافذة على الفكر والقلم العربي",
};

export default function RootLayout({ children, user }) {
    return (
        <StrictMode>
            {/* TODO: Remove in Production */}
            <html dir="rtl" lang="ar" className={nastaliqUrdu.variable}>
                <head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <link
                        rel="preconnect"
                        href="https://fonts.googleapis.com"
                    />
                    <link
                        rel="preconnect"
                        href="https://fonts.gstatic.com"
                        crossOrigin="anonymous"
                    />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Noto+Serif+Arabic:wght@400;700&display=swap"
                        rel="stylesheet"
                    />
                </head>
                <body>
                    <UserProvider>{children}</UserProvider>
                </body>
            </html>
        </StrictMode>
    );
}
