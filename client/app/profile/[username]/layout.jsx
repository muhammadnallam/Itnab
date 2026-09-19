import { getProfileByUsername } from "@/lib/data/profiles";

export async function generateMetadata({ params }) {
    const { username } = await params;

    try {
        const profile = await getProfileByUsername(username);
        const title = profile.name;
        const description =
            profile.bio?.trim() || `اقرأ مقالات ${profile.name} على إطناب.`;
        const canonical = `/@${profile.username}`;

        return {
            title,
            description,
            alternates: { canonical },
            openGraph: {
                type: "profile",
                title,
                description,
                url: canonical,
            },
            twitter: { card: "summary", title, description },
        };
    } catch {
        return { robots: { index: false, follow: false } };
    }
}

export default function ProfileLayout({ children }) {
    return children;
}
