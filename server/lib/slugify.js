import normalize from "./normalize.js";
import Article from "../models/article.js";
import { nanoid } from "nanoid";

const stopWords = [
    "في",
    "من",
    "إلى",
    "على",
    "عن",
    "مع",
    "هذا",
    "هذه",
    "التي",
    "الذي",
    "وهو",
    "وهي",
    "كان",
    "كانت",
    "بين",
    "حول",
    "عند",
    "قبل",
    "بعد",
    "لكن",
    "أو",
    "ثم",
];

async function slugify(title, tag) {
    let slug;
    const article = new Article();

    slug = normalize(title);

    slug = slug.replace(/\s+/g, "-").replace(/[،؛!.,"']/g, "");

    slug = `/${tag}/` + slug;

    const exists = await article.slugExists(slug)
    if (exists) {
        slug += nanoid(4);
    }

    console.log(slug);
}

const arabicTitles = [
    "كيف تُطور مهاراتك في البرمجة بلغة بايثون؟",
    "أهم التطورات التقنية التي ستُغير عالمنا في عام 2026",
    "دليلك الشامل لفهم الذكاء الاصطناعي وتطبيقاته العملية",
    "لماذا يجب عليك تعلم لغة جديدة في سن مبكرة؟",
    "أسرار النجاح في إدارة الوقت والانتاجية العالية",
    "التغيرات المناخية: تحديات وحلول مستدامة للمستقبل",
    "رحلة إلى قلب التاريخ الإسلامي: من الأندلس إلى بغداد",
    "كيف تحمي بياناتك الشخصية على الإنترنت من الاختراق؟",
    "فوائد الصيام المتقطع للصحة الجسدية والعقلية",
    "مستقبل الطاقة المتجددة: هل يمكننا الاعتماد عليها كلياً؟",
];

for (let t of arabicTitles) {
    slugify(t, "مجتمع");
}

export default slugify;
