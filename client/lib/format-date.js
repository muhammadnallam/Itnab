export function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

// Arabic plural rules: 1 → singular, 2 → dual, 3-10 → plural, 11+ → singular
const UNITS = [
    { limit: 60, div: 1, one: "دقيقة", two: "دقيقتين", few: "دقائق", many: "دقيقة" },
    { limit: 24, div: 60, one: "ساعة", two: "ساعتين", few: "ساعات", many: "ساعة" },
    { limit: 7, div: 1440, one: "يوم", two: "يومين", few: "أيام", many: "يوم" },
];

export function formatRelativeTime(dateStr) {
    const then = new Date(dateStr).getTime();
    const diffMin = Math.floor((Date.now() - then) / 60000);

    if (diffMin < 1) return "الآن";

    for (const u of UNITS) {
        const n = Math.floor(diffMin / u.div);
        if (n < 1) continue;
        if (u.limit !== null && n >= u.limit && u.div !== 1440) continue;
        if (u.div === 1440 && n >= 7) break;
        if (n === 1) return `منذ ${u.one}`;
        if (n === 2) return `منذ ${u.two}`;
        if (n <= 10) return `منذ ${n} ${u.few}`;
        return `منذ ${n} ${u.many}`;
    }

    return formatDate(dateStr);
}
