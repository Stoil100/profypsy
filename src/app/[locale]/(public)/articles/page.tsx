"use client";

import { ArticleT } from "@/components/forms/article";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { db } from "@/firebase/config";
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
import umbrellaImage from "@/../public/articles/umbrella.png";
import Image from "next/image";

const ArticleCard: React.FC<ArticleT> = (article) => {
    const getRandomGridSize = () => {
        const cols = Math.floor(Math.random() * 2) + 1;
        const rows = Math.floor(Math.random() * 2) + 1;
        return `col-span-${cols} row-span-${rows}`;
    };

    const router = useRouter();
    const t = useTranslations("Article");

    return (
        <Link
            href={`articles/${article.id}`}
            className={`relative rounded-md ${getRandomGridSize()} group h-full w-full overflow-hidden`}
            onClick={() => {
                router.push(`articles/${article.id}`);
            }}
        >
            <img
                src={article.image}
                alt={article.title}
                className="h-full w-full transform rounded-md object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 flex h-full flex-col justify-between rounded-md bg-gradient-to-b from-white/20 to-black/80 p-2">
                <Badge className="z-50 w-fit bg-[#25BA9E]">
                    {t("mostRecent")}
                </Badge>
                <div className="text-white">
                    <div className="flex items-center gap-2">
                        <img
                            src={article.creatorImage}
                            className="aspect-square size-8 rounded-full object-cover"
                        />
                        <p>{article.creatorUserName}</p>
                    </div>
                    <h2 className="font-playfairDSC text-5xl font-bold">
                        {article.title}
                    </h2>
                    <p className="line-clamp-4 text-xl">
                        {article.descriptions![0].description}
                    </p>
                </div>
            </div>
        </Link>
    );
};

type ArticleGridProps = {
    articles: ArticleT[];
};

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => {
    return (
        <div className="grid-auto-flow-dense grid w-full grid-cols-2 md:grid-cols-4 gap-4">
            {articles.map((article, index) => (
                <ArticleCard key={index} {...article} />
            ))}
        </div>
    );
};

export default function Articles() {
    const [articles, setArticles] = useState<ArticleT[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations("Article");
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
            <div className="mb-10 mt-4 flex h-fit w-full items-center justify-center bg-contain bg-center bg-no-repeat md:h-[calc(100vh-6rem)] md:bg-[url('/articles/hero.png')] md:py-10">
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
            <ArticleGrid articles={articles} />
        </main>
    );
}
