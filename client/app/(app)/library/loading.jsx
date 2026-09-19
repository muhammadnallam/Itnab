import PageContent from "@/components/PageContent";
import ArticleCardSkeleton from "@/components/ArticleCardSkeleton";

export default function Loading() {
    return (
        <PageContent>
            {[1, 2, 3].map((i) => (
                <ArticleCardSkeleton key={i} />
            ))}
        </PageContent>
    );
}
