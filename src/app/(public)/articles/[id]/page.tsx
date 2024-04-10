"use client";
import GradientButton from "@/components/MainButton";
import { ArticleT } from "@/components/schemas/article";
import { db } from "@/firebase/config";
import {
    collection,
    doc,
    getDoc,
    limit,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { useEffect, useState } from "react";

function useArticles(articleId: string) {
    const [articles, setArticles] = useState<ArticleT[]>([]);
    const [currentArticle, setCurrentArticle] = useState<ArticleT | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(collection(db, "articles"), orderBy("createdAt"));
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const fetchedArticles: ArticleT[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedArticles.push(doc.data() as ArticleT);
                });
                setArticles(fetchedArticles);
                // After setting all articles, find the current article based on articleId
                const foundArticle = fetchedArticles.find(
                    (article) => article.id?.toString() === articleId,
                );
                setCurrentArticle(foundArticle || null);
                setLoading(false);
            },
            (error) => {
                setError(error);
                setLoading(false);
                console.error("Error fetching articles:", error);
            },
        );

        return () => unsubscribe(); // Cleanup on unmount
    }, [articleId]); // Depend on articleId to refetch everything if it changes

    return { articles, currentArticle, loading, error };
}

export default function Article({ params }: { params: { id: string } }) {
    const { articles, currentArticle, loading, error } = useArticles(params.id);
    return (
        <main className="flex h-fit w-full bg-gradient-to-b from-[#F7F4E0] to-[#F1ECCC] pt-20 pb-4">
            <div className="w-full space-y-4 p-3 text-[#205041] md:w-3/4 md:p-8">
                <h2 className="text-center text-4xl font-bold">
                    {currentArticle?.title}
                </h2>
                <img src={currentArticle?.image} />
                <div className="space-y-4 px-2">
                    {currentArticle?.descriptions.map((desc) => (
                        <div key={desc.descTitle}>
                            <h3 className="text-3xl">{desc.descTitle}</h3>
                            <p className="px-4 text-lg">{desc.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="hidden w-1/4 flex-col items-center gap-10 border-l-2 border-black pt-20 md:flex">
                <div className=" flex w-1/2 flex-col items-center gap-3">
                    <h3 className="text-center text-xl">
                        Get the latest articles straight to your email box
                    </h3>
                    <GradientButton>Subscribe to our newsletter</GradientButton>
                </div>
                <div className="sticky top-20 flex w-2/3 flex-col items-center justify-center gap-2">
                    <h2 className="self-start text-3xl">Newest Posts:</h2>
                    <hr className="w-full border border-black"/>
                    <div className="space-y-4 pt-4">
                        {articles!.slice(0, 6).map((article) => (
                            <div
                                className="flex cursor-pointer items-start justify-center gap-4 flex-col transition-transform hover:scale-105"
                                key={article.id}
                            >
                                <img
                                    src={article.image}
                                    className="h-auto w-full rounded-xl"
                                />
                                <h4 className="text-xl md:max-lg:text-center">
                                    {article.title}
                                </h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
