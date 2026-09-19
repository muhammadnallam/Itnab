import "./globals.css";
import "./layout.css";
import localFont from "next/font/local";
import UserProvider from "@/context/UserContext";
import ScreenProvider from "@/context/ScreenContext";
import AuthModalProvider from "@/context/AuthModalContext";
import SidebarProvider from "@/context/SidebarContext";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const wordmarkFont = localFont({
    src: [
        {
            path: "../public/fonts/ae_cortoba_regular.ttf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-wordmark",
});

export const metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000",
    ),
    title: { default: "إطناب", template: "%s | إطناب" },
    description: "نافذة على الفكر والقلم العربي",
    openGraph: {
        type: "website",
        siteName: "إطناب",
        locale: "ar_AR",
        url: "/",
        title: "إطناب",
        description: "نافذة على الفكر والقلم العربي",
        images: [{ url: "/logo.png", width: 912, height: 776, alt: "إطناب" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "إطناب",
        description: "نافذة على الفكر والقلم العربي",
        images: ["/logo.png"],
    },
};

export default function RootLayout({ children }) {
    return (
        <html dir="rtl" lang="ar" className={wordmarkFont.variable} suppressHydrationWarning>
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){var d=document.documentElement;try{d.dataset.sidebar=window.localStorage.getItem('itnab.sidebar')==='0'?'closed':'open'}catch(e){d.dataset.sidebar='open'}})();`,
                    }}
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
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
                <QueryProvider>
                    <ScreenProvider>
                        <SidebarProvider>
                            <UserProvider>
                                <AuthModalProvider>{children}</AuthModalProvider>
                            </UserProvider>
                        </SidebarProvider>
                    </ScreenProvider>
                </QueryProvider>
                <Toaster />
            </body>
        </html>
    );
}
