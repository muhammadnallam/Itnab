import "./globals.css";

export const metadata = {
    title: "منصة وسيلة",
    description: "نافذة على الفكر والقلم العربي",
};

export default function RootLayout({ children }) {
    return (
        <html dir="rtl" lang="ar">
            <head>
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
            <body>{children}</body>
        </html>
    );
}
