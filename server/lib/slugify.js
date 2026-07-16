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

export default slugify;
