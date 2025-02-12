"use client";

import { db } from "@/firebase/config";
import { cn } from "@/lib/utils";
import { ArticleT } from "@/models/article";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type ArticleCardProps = {
    article: ArticleT;
    t: (args: string) => string;
};
const ArticleCard: React.FC<ArticleCardProps> = ({ article, t }) => {
    const getRandomGridSize = () => {
        const cols = Math.floor(Math.random() * 2) + 1;
        const rows = Math.floor(Math.random() * 2) + 1;
        return `col-span-${cols} row-span-${rows}`;
    };

    const router = useRouter();

    return (
        <Link
            href={`articles/${article.id}`}
            className={cn(
                "group relative col-span-1 row-span-1 flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl text-white",
                article.type === "important" && "sm:col-span-2 sm:row-span-2",
                article.type === "notable" && "sm:col-span-2",
            )}
        >
            <img
                src={article.heroImage}
                alt={article.title}
                className="h-full w-full transform object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute top-2 flex w-full justify-between px-2">
                <h4 className="text-xl font-extralight">
                    {article.creatorUserName}
                </h4>
            </div>
            <div className="absolute bottom-2 left-2 space-y-4">
                <h2
                    className={cn(
                        article.type === "important" ? "text-5xl" : "text-4xl",
                    )}
                >
                    {article.title}
                </h2>
                {article.type === "important" && (
                    <p className="text-lg font-extralight">
                        {article.titleDescriptions![0].value}
                    </p>
                )}
            </div>
        </Link>
    );
};

type ArticleGridProps = {
    articles: ArticleT[];
    t: (args: string) => string;
};

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, t }) => {
    return (
        <div className="grid-auto-flow-dense grid w-full grid-cols-2 gap-4 md:grid-cols-4">
            {articles.map((article, index) => (
                <ArticleCard key={index} article={article} t={t} />
            ))}
        </div>
    );
};

export default function Articles() {
    const [articles, setArticles] = useState<ArticleT[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations("Pages.Article");
    useEffect(() => {
        function fetchItems() {
            setIsLoading(true);

            const q = query(
                collection(db, "articles"),
                where("approved", "==", true),
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
        <main className="flex min-h-screen w-full flex-col items-center gap-4 px-4 py-3 lg:px-20">
            <div className="mb-10 mt-4 flex h-fit w-full items-center justify-center bg-contain bg-center bg-no-repeat md:h-screen md:bg-[url('/articles/hero.png')] md:py-10">
                <div className="flex max-w-2xl flex-col items-center space-y-4 rounded-lg text-center backdrop-blur-md md:p-4 md:text-white">
                    <h1 className="rounded font-playfairDSC text-5xl italic">
                        {t("pageTitle")}
                    </h1>
                    <p className="hidden font-nunito text-xl md:block">
                        {t("description")}
                    </p>
                    <Link
                        href="#articles"
                        className=" hidden w-fit rounded-md  bg-[#25BA9E] p-1 px-2 text-white transition-transform hover:scale-105 md:block"
                    >
                        {t("readMore")}
                    </Link>
                </div>
            </div>
            <ArticleGrid articles={articles} t={t} />
        </main>
    );
}
