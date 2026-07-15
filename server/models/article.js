import prisma from "../lib/prisma.js";

class Article {
    async slugExists(slug) {
        const result = await prisma.article.findUnique({
            where: { slug: slug },
        });

        return result;
    }
}

export default Article;
