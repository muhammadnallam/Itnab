import cron from "node-cron";
import prisma from "../../lib/prisma.js";
import extractText from "../../lib/extractText.js";
import { AuthorizationError, NotFoundError } from "../../lib/errors.js";

const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const CRON_EXPRESSION = "0 3 * * *";

const SUMMARY_SELECT = {
    id: true,
    title: true,
    wordCount: true,
    seoTitle: true,
    seoDescription: true,
    topic: true,
    expiresAt: true,
    createdAt: true,
    updatedAt: true,
    articleId: true,
};

function readNodeText(node) {
    if (!node) return "";
    if (node.type === "text" && typeof node.text === "string") {
        return node.text;
    }
    if (Array.isArray(node.content)) {
        for (const child of node.content) {
            const text = readNodeText(child);
            if (text) return text;
        }
    }
    return "";
}

function deriveTitle(content) {
    const first = content?.content?.[0];
    const text =
        first?.type === "articleTitle"
            ? readNodeText(first)
            : readNodeText(content);
    return text.trim() || null;
}

function countWords(content) {
    return extractText(content).split(/\s+/).filter(Boolean).length;
}

function buildDraftData(content, { seoTitle, seoDescription, topic }) {
    return {
        title: deriveTitle(content),
        wordCount: countWords(content),
        content,
        seoTitle: seoTitle ?? null,
        seoDescription: seoDescription ?? null,
        topic: topic ?? null,
        expiresAt: new Date(Date.now() + DRAFT_TTL_MS),
    };
}

export async function listDrafts(userId, articleId) {
    const drafts = await prisma.draft.findMany({
        where: {
            userId,
            articleId: articleId ?? null,
            expiresAt: { gt: new Date() },
        },
        orderBy: { updatedAt: "desc" },
        select: SUMMARY_SELECT,
    });
    return { drafts };
}

export async function getDraft(id, userId) {
    const draft = await prisma.draft.findFirst({ where: { id, userId } });
    if (!draft) throw new NotFoundError("المسودة غير موجودة");
    return draft;
}

async function getOwnedDraft(id, userId, permissionMessage) {
    const draft = await prisma.draft.findUnique({ where: { id } });
    if (!draft) throw new NotFoundError("المسودة غير موجودة");
    if (draft.userId !== userId)
        throw new AuthorizationError(permissionMessage);
    return draft;
}

export async function createDraft(userId, data) {
    const { content, articleId } = data;
    const draftData = buildDraftData(content, data);

    if (articleId) {
        const existing = await prisma.draft.findUnique({
            where: { articleId },
        });
        if (existing) {
            if (existing.userId !== userId) {
                throw new AuthorizationError(
                    "ليس لديك صلاحية تعديل هذه المسودة",
                );
            }
            return prisma.draft.update({
                where: { id: existing.id },
                data: draftData,
            });
        }
    }

    return prisma.draft.create({
        data: {
            ...draftData,
            userId,
            articleId: articleId ?? null,
        },
    });
}

export async function updateDraft(id, userId, data) {
    await getOwnedDraft(id, userId, "ليس لديك صلاحية تعديل هذه المسودة");

    const { content } = data;
    return prisma.draft.update({
        where: { id },
        data: buildDraftData(content, data),
    });
}

export async function deleteDraft(id, userId) {
    await getOwnedDraft(id, userId, "ليس لديك صلاحية حذف هذه المسودة");
    await prisma.draft.delete({ where: { id } });
    return { success: true };
}

export async function purgeExpiredDrafts() {
    const result = await prisma.draft.deleteMany({
        where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
}

let isRunning = false;

export function startDraftCleanupCron() {
    cron.schedule(CRON_EXPRESSION, async () => {
        if (isRunning) {
            console.warn(
                "[draft] Skipping run: previous run still in progress",
            );
            return;
        }
        isRunning = true;
        try {
            const deleted = await purgeExpiredDrafts();
            console.log(`[draft] Purged ${deleted} expired drafts`);
        } catch (err) {
            console.error("[draft] Purge failed:", err);
        } finally {
            isRunning = false;
        }
    });
    console.log(`[draft] Cron scheduled (${CRON_EXPRESSION})`);
}
