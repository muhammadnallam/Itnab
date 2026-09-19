import { getListById } from "@/lib/data/lists";

export async function generateMetadata({ params }) {
    const { id } = await params;

    try {
        const list = await getListById(id);

        return {
            title: list.name,
            description: `قائمة قراءة «${list.name}» على إطناب.`,
            alternates: { canonical: `/list/${id}` },
        };
    } catch {
        return { robots: { index: false, follow: false } };
    }
}

export default function ListLayout({ children }) {
    return children;
}
