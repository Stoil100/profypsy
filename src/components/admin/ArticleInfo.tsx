import { Button } from "@/components/ui/button";
import { db } from "@/firebase/config";
import type { ArticleT } from "@/models/article";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { EyeIcon, Trash2 } from "lucide-react";
import type React from "react";

type ArticleInfoProps = {
    article: ArticleT;
    t: (args: string) => string;
    setPreviewArticle: React.Dispatch<
        React.SetStateAction<ArticleT | undefined>
    >;
};

export const ArticleInfo: React.FC<ArticleInfoProps> = ({
    article,
    t,
    setPreviewArticle,
}) => {
    const approveArticle = async (id: string) => {
        const articlesRef = doc(db, "articles", id);
        await updateDoc(articlesRef, {
            approved: true,
        });
    };

    const deleteArticle = async (id: string) => {
        await deleteDoc(doc(db, "articles", id));
    };

    return (
        <div className="flex aspect-video w-fit max-w-lg flex-col items-center justify-between gap-1 rounded-lg bg-gray-400/20 p-3">
            <div
                className="flex h-full flex-col items-start justify-center overflow-hidden border-gray-300"
                key={article.id}
            >
                <img
                    src={article.heroImage}
                    alt={article.title}
                    className="h-full w-full rounded-lg object-cover object-center"
                />
                <h4 className="md:text-lg lg:text-3xl">{article.title}</h4>
            </div>
            <div className="flex w-full gap-2">
                <Button
                    onClick={() => approveArticle(article.id!.toString())}
                    className="w-full"
                >
                    {t("approve")}
                </Button>
                <Button
                    onClick={() => setPreviewArticle(article)}
                    className="bg-[#25BA9E] hover:bg-[#25BA9E]/80"
                >
                    <EyeIcon />
                </Button>
                <Button
                    onClick={() => deleteArticle(article.id!.toString())}
                    variant="destructive"
                >
                    <Trash2 />
                </Button>
            </div>
        </div>
    );
};
