import MainButton from "@/components/MainButton";
import { ArticleForm } from "@/components/forms/article/Content";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArticleT } from "@/models/article";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteArticle, fetchArticles } from "./utils";

export default function ArticlesList({ t }: { t: (args: string) => string }) {
    const [articles, setArticles] = useState<ArticleT[]>([]);

    useEffect(() => {
        const unsubscribe = fetchArticles(setArticles);
        return () => unsubscribe();
    }, []);

    return (
        <div className="flex flex-col pr-1">
            {articles && articles.length > 0 ? (
                articles.map((article, index) => (
                    <div
                        key={index}
                        className="w-full space-y-3 rounded-md border-2 border-dashed border-black p-2"
                    >
                        <img
                            src={article.heroImage || "/placeholder.svg"}
                            alt={article.title}
                        />
                        <h3 className="text-2xl">{article.title}</h3>
                        <MainButton
                            onClick={() => {
                                deleteArticle(article.id!);
                            }}
                            className="border-2 border-red-500 text-red-500"
                        >
                            <Trash2Icon /> {t("deleteArticle")}
                        </MainButton>
                    </div>
                ))
            ) : (
                <h2 className="text-center text-xl">
                    {t("noArticlesCreated")}
                </h2>
            )}
            <Dialog>
                <DialogTrigger className="mt-4 w-[90%] self-center rounded-full border-2 border-[#25BA9E] px-2 py-1 text-center text-xl text-[#25BA9E] transition-transform hover:scale-105">
                    {t("uploadArticle")}
                </DialogTrigger>
                <DialogContent className="max-w-3xl !rounded-sm border-8 border-[#25BA9E] p-1">
                    <ScrollArea className="max-h-[70vh] w-full p-4">
                        <ArticleForm />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
