function normalizeArabic(text) {
    return (
        text
            .replace(
                /[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED\u08D3-\u08FF\u0670]/g,
                "",
            )
            .replace(/\u0640/g, "")
            .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
            .replace(/\u0649/g, "\u064A")
            .replace(/\u0629/g, "\u0647")
            .replace(/[\u0624\u0626]/g, "\u0621")
            .replace(/\s+/g, " ")
            .trim()
    );
}

export default normalizeArabic;
