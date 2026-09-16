import puppeteer from "puppeteer-core";

const CHROME_PATH =
    process.env.CHROME_PATH ||
    "/home/mohamed/.cache/puppeteer/chrome/linux-153.0.8010.36/chrome-linux64/chrome";

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function buildHtml({ title, subtitle, topic, authorName, coverImage, html }) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<style>
@import url("https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap");

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { direction: rtl; }

body {
    font-family: "Noto Serif Arabic", Georgia, serif;
    color: #1a1714;
    background: #fff;
    line-height: 1.8;
    font-size: 18px;
    padding: 0;
}

.page {
    max-width: 740px;
    margin: 0 auto;
    padding: 48px 24px 64px;
}

.topic {
    color: #1a5c4a;
    letter-spacing: 0.1em;
    font-weight: 700;
    margin-bottom: 16px;
    font-size: 0.95rem;
}

h1 {
    font-weight: 400;
    font-size: 2.85rem;
    line-height: 1.5;
    margin-bottom: 20px;
    color: #1a1714;
}

.subtitle {
    font-size: 1.15rem;
    line-height: 1.6;
    color: #4a4540;
    margin-bottom: 24px;
    font-weight: 400;
}

.author {
    margin-bottom: 32px;
    font-size: 1rem;
    color: #1a1714;
}

.cover {
    width: 100%;
    margin-bottom: 32px;
    border-radius: 2px;
    aspect-ratio: 1.91 / 1;
    object-fit: cover;
}

.date {
    font-size: 0.85rem;
    color: #6b6b6b;
    border-bottom: 1px solid #c8c0b4;
    padding-bottom: 16px;
    margin-bottom: 36px;
}

.content {
    line-height: 2.05;
    font-weight: 400;
}

.content p {
    margin: 0 0 1.6em 0;
}

.content p:last-child {
    margin-bottom: 0;
}

.content h1,
.content h2,
.content h3,
.content h4,
.content h5,
.content h6 {
    font-weight: 700;
    color: #1a1714;
    margin: 1.8em 0 0.7em 0;
    line-height: 1.5;
}

.content h1:first-child,
.content h2:first-child,
.content h3:first-child {
    margin-top: 0;
}

.content h1 { font-size: 2.4em; line-height: 1.35; }
.content h2 { font-size: 1.9em; line-height: 1.4; }
.content h3 { font-size: 1.5em; }
.content h4 { font-size: 1.25em; font-weight: 700; }
.content h5 { font-size: 1.1em; font-weight: 700; }
.content h6 { font-size: 1em; font-weight: 700; color: #6b6b6b; }

.content a {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: rgba(26, 23, 20, 0.35);
    text-underline-offset: 3px;
    text-decoration-thickness: 1px;
}

.content blockquote {
    margin: 1.9em 0;
    padding: 0.2em 1.4em 0.2em 0;
    border-right: 3px solid #1a5c4a;
    font-size: 1.2em;
    line-height: 1.75;
    color: rgba(26, 23, 20, 0.88);
}

.content blockquote p {
    margin-bottom: 0.5em;
}

.content blockquote cite {
    display: block;
    margin-top: 0.6em;
    font-style: normal;
    font-size: 0.6em;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: rgba(26, 23, 20, 0.55);
}

.content blockquote cite::before {
    content: "\\2014\\0020";
}

.content ul,
.content ol {
    margin: 0 0 1.6em 0;
    padding-right: 1.4em;
    padding-left: 0;
}

.content li {
    margin-bottom: 0.55em;
}

.content li:last-child {
    margin-bottom: 0;
}

.content ul {
    list-style-type: "\\2013\\0020";
}
.content ul ul {
    list-style-type: "\\25E6\\0020";
}
.content ol {
    list-style-type: decimal;
}

.content code {
    direction: ltr;
    unicode-bidi: isolate;
    font-family: "SFMono-Regular", Consolas, monospace;
    font-size: 0.85em;
    background: rgba(26, 23, 20, 0.06);
    padding: 0.15em 0.4em;
    border-radius: 4px;
}

.content pre {
    direction: ltr;
    text-align: left;
    margin: 1.8em 0;
    padding: 1.1em 1.3em;
    overflow-x: auto;
    background: rgba(26, 23, 20, 0.06);
    border-radius: 8px;
    border: 1px solid rgba(26, 23, 20, 0.1);
}

.content pre code {
    background: none;
    padding: 0;
    font-size: 0.85em;
    line-height: 1.6;
}

.content img {
    display: block;
    width: 100%;
    height: auto;
    margin: 1.9em 0;
    border-radius: 2px;
}

.content hr {
    border: none;
    border-top: 1px solid rgba(26, 23, 20, 0.15);
    margin: 2.4em 0;
}

.content .quran-verse {
    display: inline;
    color: #1a7a5a;
    font-style: normal;
    line-height: 2;
    word-spacing: 2px;
}

.content .quran-verse-text {
    color: #1a7a5a;
    font-weight: 500;
}

.content .quran-verse-ref {
    display: inline-block;
    font-size: 0.8em;
    color: rgba(26, 23, 20, 0.5);
    margin-right: 4px;
    font-weight: 400;
}

.footer {
    margin-top: 48px;
    padding-top: 16px;
    border-top: 1px solid #c8c0b4;
    text-align: center;
    font-size: 0.8rem;
    color: #6b6b6b;
}

@media print {
    body { background: #fff; }
    .page { padding: 0; max-width: none; }
}

@page {
    margin: 2cm;
    size: A4;
}
</style>
</head>
<body>
<div class="page">
    <p class="topic">${escapeHtml(topic)}</p>
    <h1>${escapeHtml(title)}</h1>
    <p class="subtitle">${escapeHtml(subtitle)}</p>
    <p class="author">من ${escapeHtml(authorName)}</p>
    ${
        coverImage
            ? `<img class="cover" src="${escapeHtml(coverImage)}" alt="${escapeHtml(title)}" />`
            : ""
    }
    <div class="content">${html}</div>
    <div class="footer">إطناب</div>
</div>
</body>
</html>`;
}

let browserInstance = null;

async function getBrowser() {
    if (browserInstance && browserInstance.connected) {
        return browserInstance;
    }
    browserInstance = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
        ],
    });
    return browserInstance;
}

export async function generateArticlePdf({
    title,
    subtitle,
    topic,
    authorName,
    coverImage,
    html,
}) {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        const htmlContent = buildHtml({
            title,
            subtitle,
            topic,
            authorName,
            coverImage,
            html,
        });

        await page.setContent(htmlContent, { waitUntil: "networkidle0", timeout: 15000 });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "2cm", bottom: "2cm", left: "2cm", right: "2cm" },
        });

        return pdfBuffer;
    } finally {
        await page.close();
    }
}

export async function closeBrowser() {
    if (browserInstance) {
        await browserInstance.close();
        browserInstance = null;
    }
}
