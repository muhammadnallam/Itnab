import JSZip from "jszip";
import { generateHTML } from "@tiptap/html";
import { extensions } from "@itnab/tiptap";

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function buildArticleHtml({ title, subtitle, content }) {
    const body = generateHTML(content, extensions);
    const safeTitle = escapeHtml(title);
    const safeSubtitle = escapeHtml(subtitle);

    return [
        "<!DOCTYPE html>",
        '<html lang="ar" dir="rtl">',
        "<head>",
        '<meta charset="utf-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1" />',
        `<title>${safeTitle}</title>`,
        "</head>",
        "<body>",
        `<h1>${safeTitle}</h1>`,
        safeSubtitle ? `<p>${safeSubtitle}</p>` : "",
        body,
        "</body>",
        "</html>",
    ]
        .filter(Boolean)
        .join("\n");
}

export async function buildArticlesZip(articles) {
    const zip = new JSZip();

    for (const article of articles) {
        zip.file(`${article.slug}.html`, buildArticleHtml(article));
    }

    return zip.generateAsync({ type: "nodebuffer" });
}
