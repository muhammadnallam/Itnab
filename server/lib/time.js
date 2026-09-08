export function getMonthBounds(date = new Date(), tz = "Asia/Riyadh") {
    const parts = new Intl.DateTimeFormat("en", {
        timeZone: tz, year: "numeric", month: "numeric", day: "numeric",
    }).formatToParts(date);
    const get = (type) => parseInt(parts.find(p => p.type === type).value);
    const year = get("year"), month = get("month"); // 1-indexed
    const gte = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const lt = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
    return { gte, lt };
}

export function getYearBounds(date = new Date(), tz = "Asia/Riyadh") {
    const parts = new Intl.DateTimeFormat("en", {
        timeZone: tz, year: "numeric",
    }).formatToParts(date);
    const year = parseInt(parts.find(p => p.type === "year").value);
    const gte = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0));
    const lt = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0));
    return { gte, lt };
}

export function getMonthName(date = new Date(), tz = "Asia/Riyadh") {
    return new Intl.DateTimeFormat("ar-EG", { timeZone: tz, month: "long" }).format(date);
}
