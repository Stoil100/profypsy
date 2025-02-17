import { ArticleT } from "@/models/article";
import Link from "next/link";

interface ArticlesListProps {
    articles: ArticleT[];
    t: (args: string) => string;
}

export function ArticlesList({ articles, t }: ArticlesListProps) {
    if (articles.length === 0) return null;

    return (
        <div className="space-y-2 font-openSans">
            <h2 className="text-3xl">{t("myArticles")}</h2>
            <div className="flex flex-wrap gap-4">
                {articles.map((article) => (
                    <Link
                        key={article.id}
                        href={`/articles/${article.id}`}
                        className="flex max-w-xs flex-col rounded-lg bg-gray-500/20 p-2 transition-transform hover:scale-105"
                    >
                        <img
                            src={article.heroImage || "/placeholder.svg"}
                            alt={article.title}
                            width={320}
                            height={180}
                            className="h-full max-h-40 rounded object-cover object-center"
                        />
                        <h5 className="text-xl">{article.title}</h5>
                    </Link>
                ))}
            </div>
        </div>
    );
}
