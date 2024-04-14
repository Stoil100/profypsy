"use client";

import { ArticleT } from "@/components/schemas/article";
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
                {article.descriptions![0].description}
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
    const [articles, setArticles] = useState<ArticleT[]>([]);
    const [isLoading, setIsLoading] = useState(false);

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
        <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#F7F4E0] to-[#F1ECCC] px-2 py-20">
            <h1 className="border-b-2 border-[#25BA9E] pb-2 text-center font-playfairDSC text-5xl italic">
                Profypsy&apos;s Articles
            </h1>
            <div className="mb-10 flex max-w-3xl flex-col items-center rounded-2xl bg-white p-2 ">
                <h4 className="w-fit border-b-2 px-2 pb-2 text-center text-3xl italic">
                    Our most popular articles:
                </h4>
                <Carousel className="w-full">
                    <CarouselContent>
                        {articles?.map((article, index) => (
                            <CarouselItem key={index}>
                                <div
                                    style={{
                                        backgroundImage: `url(${article.image})`,
                                    }}
                                    className="flex min-h-[30vh] flex-wrap items-end gap-10  rounded-xl bg-cover "
                                >
                                    <div className="h-full w-full rounded-b-xl bg-black/70 p-2 text-white">
                                        <h2 className="text-2xl italic">
                                            &quot;{article.title}&quot;
                                        </h2>
                                        <Link
                                            href={`articles/${article.id}`}
                                            className="block w-fit rounded-full bg-[#25BA9E] p-1 px-2 text-white transition-transform hover:scale-105"
                                        >
                                            Read more
                                        </Link>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {articles!.length! > 1 && (
                        <>
                            <CarouselPrevious className="md:flex hidden"/>
                            <CarouselNext className="md:flex hidden" />
                        </>
                    )}
                </Carousel>
            </div>
            <div className="flex w-full flex-wrap items-center justify-around gap-2 max-w-6xl">
                {articles?.map((article, index) => (
                    <ArticleCard {...article} key={index} />
                ))}
            </div>
        </main>
    );
}
