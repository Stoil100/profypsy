"use client";

import { ArticleT } from "@/components/schemas/article";
import { Badge } from "@/components/ui/badge";
import { db } from "@/firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ArticleCard: React.FC<ArticleT> = (article) => {
    const router = useRouter();
    return (
        <div
            className="max-w-xs space-y-3 rounded-xl transition-transform hover:scale-105"
            onClick={() => {
                router.push(`articles/${article.id}`);
            }}
        >
            <div className="relative flex h-fit items-end">
                <img
                    src={article.image!}
                    className="top-0 h-auto w-full rounded-xl"
                />
                <Badge className="absolute z-50">Most recent</Badge>
            </div>
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="line-clamp-4">
                {article.descriptions[0].description}
            </p>
            <Link
                href={`articles/${article.id}`}
                className="block w-fit rounded-full bg-[#25BA9E] p-1 px-2 text-white"
            >
                Read more
            </Link>
        </div>
    );
};

export default function Articles() {
    const [articles, setArticles] = useState<ArticleT[]>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        function fetchItems() {
            setIsLoading(true);

            const q = query(
                collection(db, "articles"),
                orderBy("createdAt"),
            );
            const unsubscribe = onSnapshot(
                q,
                (querySnapshot) => {
                    const tempValues: ArticleT[] = [];
                    querySnapshot.forEach((doc) => {
                        tempValues.push(doc.data() as ArticleT);
                    });
                    setArticles(tempValues);
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Error fetching items: ", error);
                    setIsLoading(false);
                },
            );

            return unsubscribe;
        }
        fetchItems();
    }, []);
    return (
        <main className="w-full min-h-screen flex justify-center bg-gradient-to-b from-[#F7F4E0] to-[#F1ECCC]">
        <div className="flex justify-center max-w-2xl w-full items-center flex-wrap">
            {articles?.map((article, index) => (
                <ArticleCard {...article} key={index} />
            ))}
        </div>
        </main>
    );
}
