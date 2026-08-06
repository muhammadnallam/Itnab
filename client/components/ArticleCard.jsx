import { useState } from "react";

import Avatar from "@/components/ui/Avatar";
import { Bookmark, Ellipsis } from "lucide-react";

const ArticleCard = ({ article, isMobile }) => {
    const [saved, setSaved] = useState(false);

    return (
        <article
            style={{
                padding: "24px 0",
                borderBottom: "1px solid var(--color-border)",
            }}
        >
            {/* TODO: Additional Information (Reason of recommendation / Reshared by ..) */}
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2 mb-2.5 text-sm">
                        <Avatar
                            initials={article.authorAvatar}
                            size={24}
                            bg="var(--color-accent)"
                        />
                        <span className="font-medium">{article.author}</span>
                        <span className="font-bold">·</span>
                        <span className="text-(--color-light)">
                            {article.date}
                        </span>
                    </div>

                    <a href={`/article/${article.slug}`}>
                        <h2
                            className="font-semibold leading-normal mb-1.5 cursor-pointer"
                            style={{ fontSize: isMobile ? 17 : 20 }}
                        >
                            {article.title}
                        </h2>
                    </a>

                    <p
                        className="leading-relaxed text-sm text-(--color-light) overflow-hidden line-clamp-2"
                        style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {article.excerpt}
                    </p>
                </div>

                {article.image && (
                    <img
                        src={article.image}
                        alt={article.excerpt}
                        className="shrink-0 rounded-sm"
                        style={{
                            width: isMobile ? 88 : 120,
                            height: isMobile ? 88 : 120,
                            objectFit: "cover",
                        }}
                    />
                )}
            </div>

            <div className="flex justify-between gap-2.5 mt-3">
                <div className="flex items-center gap-2.5">
                    <span
                        className="text-xs bg-text-select rounded-full whitespace-nowrap shrink-0"
                        style={{ padding: "4px 10px" }}
                    >
                        {article.topic}
                    </span>
                    <span className="text-(--color-light) text-sm font-bold">
                        ·
                    </span>
                    <span className="text-xs whitespace-nowrap shrink-0">
                        {article.readTime} دقائق
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setSaved((s) => !s)}
                        className={`cursor-pointer pl-1 ${
                            saved ? "text-accent" : "text-mid hover:text-ink"
                        }`}
                        style={{ transition: "color 0.15s" }}
                    >
                        <Bookmark
                            size={19}
                            fill={saved ? "var(--color-accent)" : "none"}
                            color="currentColor"
                        />
                    </button>

                    <button
                        className="cursor-pointer text-mid ml-1 hover:text-ink"
                        style={{
                            transition: "color 0.15s",
                        }}
                    >
                        <Ellipsis size={19} />
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ArticleCard;
