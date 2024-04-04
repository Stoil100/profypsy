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
    const [articles, setArticles] = useState<ArticleT[]>([]);
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
        <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#F7F4E0] to-[#F1ECCC] py-20 px-2">
            <h1 className="border-b-2 border-[#25BA9E] pb-2 font-playfairDSC text-5xl italic text-center">
                Profypsy&apos;s Articles
            </h1>
            <div className="mb-10 max-w-3xl rounded-2xl bg-white p-2 flex flex-col items-center ">
                <h4 className="border-b-2 px-2 pb-2 text-center text-3xl italic w-fit">
                    Our most popular articles:
                </h4>
                <Carousel>
                    <CarouselContent>
                        {articles?.map((article, index) => (
                            <CarouselItem key={index} className="">
                                <div style={{ backgroundImage: `url(${article.image})`}} className="bg-cover items-end flex min-h-[30vh] flex-wrap  gap-10 rounded-xl ">
                                    <div className="h-full w-full text-white bg-black/70 p-2 rounded-b-xl">
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
                            <CarouselPrevious />
                            <CarouselNext />
                        </>
                    )}
                </Carousel>
            </div>
            <div className="flex w-full max-w-2xl flex-wrap items-center justify-center">
                {articles?.map((article, index) => (
                    <ArticleCard {...article} key={index} />
                ))}
            </div>
        </main>
    );
}
