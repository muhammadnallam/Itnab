export const ARTICLE_REPORT_REASONS = [
    { id: "misleading", label: "محتوى مضلل أو غير دقيق" },
    { id: "ai-generated", label: "محتوى مولّد بالذكاء الاصطناعي" },
    { id: "plagiarism", label: "انتحال / سرقة أدبية" },
    { id: "hate-speech", label: "خطاب كراهية أو تحريض" },
    { id: "harassment", label: "تحرش أو إساءة" },
    { id: "sexual-content", label: "محتوى جنسي أو غير لائق" },
    { id: "graphic-violence", label: "عنف أو محتوى مروع" },
    { id: "self-harm", label: "ترويج للإيذاء الذاتي" },
    { id: "spam", label: "رسائل مزعجة أو ترويجية" },
    { id: "copyright", label: "انتهاك حقوق النشر" },
    { id: "illegal", label: "محتوى مخالف للقانون" },
    { id: "other", label: "سبب آخر", requiresDetails: true },
];

export const PROFILE_REPORT_REASONS = [
    { id: "ai-generated", label: "حساب ينشر محتوى مولّد بالذكاء الاصطناعي" },
    { id: "impersonation", label: "انتحال شخصية" },
    { id: "fake-account", label: "حساب وهمي أو مزيف" },
    { id: "harassment", label: "تحرش أو سلوك مسيء" },
    { id: "repeated-hate-speech", label: "خطاب كراهية متكرر" },
    { id: "inappropriate-profile", label: "معلومات ملف شخصي غير لائقة" },
    { id: "brand-impersonation", label: "انتحال هوية علامة تجارية أو مؤسسة" },
    { id: "scam", label: "نشاط مشبوه أو احتيالي" },
    { id: "other", label: "سبب آخر", requiresDetails: true },
];

export const REPORT_REASONS = {
    article: ARTICLE_REPORT_REASONS,
    profile: PROFILE_REPORT_REASONS,
};

export const ARTICLE_REPORT_REASON_IDS = ARTICLE_REPORT_REASONS.map(
    (reason) => reason.id,
);

export const PROFILE_REPORT_REASON_IDS = PROFILE_REPORT_REASONS.map(
    (reason) => reason.id,
);
