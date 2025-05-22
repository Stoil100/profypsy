"use client";
import Loader from "@/components/Loader";
import MainButton from "@/components/MainButton";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { db } from "@/firebase/config";
import { cn } from "@/lib/utils";
import { ArticleT } from "@/models/article";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
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
                const articlesList: ArticleT[] = querySnapshot.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            ...doc.data(),
                        }) as ArticleT,
                );

                setArticles(articlesList);
                const foundArticle = articlesList.find(
                    (article) => article.id! === articleId,
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

        return () => unsubscribe();
    }, [articleId]);

    return { articles, currentArticle, loading, error };
}

export default function Article({ params }: { params: { id: string } }) {
    const t = useTranslations("Pages.Article.id");
    const { articles, currentArticle, loading, error } = useArticles(params.id);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>();
    const [activeTabIndex, setActiveTabIndex] = useState<number>();
    const [api, setApi] = useState<CarouselApi>();
    useEffect(() => {
        if (!api) {
            return;
        }

        api.on("select", () => {
            setActiveTabIndex(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    if (loading) {
        return <Loader />;
    }
    return (
        <main className="flex h-fit w-full">
            <div className=" w-full space-y-6 p-2 md:w-3/4 md:p-8">
                <h1 className="text-3xl md:text-5xl">
                    {currentArticle!.title}
                </h1>
                <div className="space-y-2 px-2">
                    {currentArticle!.titleDescriptions!.map((desc, index) => (
                        <p
                            key={index}
                            className="text-md font-light md:text-xl"
                        >
                            {desc.value}
                        </p>
                    ))}
                </div>
                <img
                    src={currentArticle!.heroImage}
                    alt={currentArticle!.title}
                    className="w-full"
                />
                <div className="space-y-2 text-lg font-light md:space-y-6 md:text-2xl">
                    {currentArticle!.descriptions!.map((desc, index) => (
                        <p key={index}>{desc.value}</p>
                    ))}
                </div>
                {currentArticle!.lists!.map((list, listIndex) => (
                    <div
                        key={listIndex}
                        className="space-y-2 text-lg font-light md:text-2xl"
                    >
                        <h3>{list.title}</h3>
                        <ul className="list-disc space-y-1 px-6">
                            {list.items.map((item, itemIndex) => (
                                <li key={itemIndex}>{item.value}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                <div>
                    {currentArticle!.docs!.map((doc, docIndex) => (
                        <div key={docIndex} className="space-y-4">
                            <h2 className="text-2xl md:text-4xl">
                                {doc.title}
                            </h2>
                            {doc!.images!.length <= 2 ? (
                                <div className="flex gap-2">
                                    {doc!.images!.map((image, imageIndex) => (
                                        <img
                                            key={imageIndex}
                                            src={image.value}
                                            alt={`Doc ${docIndex} Image ${imageIndex}`}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div
                                    className="flex w-full cursor-pointer items-center gap-2"
                                    onClick={() => {
                                        setActiveIndex(docIndex);
                                        setOpen(true);
                                    }}
                                >
                                    <div className="relative w-full overflow-hidden sm:w-3/4">
                                        <img
                                            src={doc!.images![0].value}
                                            alt={`Doc ${docIndex} Image 0`}
                                        />
                                        <div className="absolute right-0 top-0 flex h-full w-1/12 items-center justify-center bg-black/70 text-white sm:hidden">
                                            <ChevronRight />
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "hidden w-1/4 gap-2 sm:flex",
                                            docIndex % 2 === 0
                                                ? "flex-col-reverse"
                                                : "flex-col",
                                        )}
                                    >
                                        <p className="flex aspect-square w-full items-center justify-center border text-center text-5xl">
                                            {doc!.images!.length - 2}+
                                        </p>
                                        <img
                                            src={doc!.images![1].value}
                                            className="h-full object-cover"
                                        />
                                    </div>
                                    {activeIndex !== undefined && (
                                        <Dialog
                                            open={open}
                                            onOpenChange={setOpen}
                                        >
                                            <DialogContent className="max-w-screen z-[999999] flex h-full  flex-col items-center justify-center border-none bg-black/80 md:p-8">
                                                <DialogTitle className="sr-only text-2xl font-light text-white">
                                                    {
                                                        currentArticle!.docs![
                                                            activeIndex
                                                        ].title
                                                    }
                                                </DialogTitle>
                                                <Carousel
                                                    className="max-w-[85vw] md:max-w-[70vw]"
                                                    style={{
                                                        marginTop:
                                                            "var(--nav-height)",
                                                    }}
                                                    setApi={setApi}
                                                    opts={{
                                                        watchDrag: false,
                                                        loop: true,
                                                    }}
                                                >
                                                    <CarouselContent className="-ml-4">
                                                        {currentArticle!.docs![
                                                            activeIndex
                                                        ].images!.map(
                                                            (image, index) => (
                                                                <CarouselItem
                                                                    key={index}
                                                                >
                                                                    <div className="flex aspect-video h-min items-center justify-center">
                                                                        <img
                                                                            src={
                                                                                image.value
                                                                            }
                                                                            alt={image.toString()}
                                                                            className="h-full w-full rounded-xl object-cover"
                                                                        />
                                                                    </div>
                                                                </CarouselItem>
                                                            ),
                                                        )}
                                                    </CarouselContent>
                                                    <CarouselNext className="max-md:hidden" />
                                                    <CarouselPrevious className="max-md:hidden" />
                                                </Carousel>
                                                <div className="flex gap-4 md:hidden">
                                                    <Button
                                                        onClick={() => {
                                                            api?.scrollPrev();
                                                        }}
                                                        className="size-10 rounded-full bg-gradient-to-t from-[#316146] to-[#088249] p-1 sm:size-12"
                                                    >
                                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#F7F4E0] text-[#52B788]">
                                                            <ArrowLeft
                                                                strokeWidth={3}
                                                            />
                                                            <span className="sr-only">
                                                                Previous slide
                                                            </span>
                                                        </div>
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            api?.scrollNext();
                                                        }}
                                                        className="size-10 rounded-full bg-gradient-to-t from-[#40916C] to-[#52B788] p-1 sm:size-12"
                                                    >
                                                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#F7F4E0] text-[#52B788]">
                                                            <ArrowRight
                                                                strokeWidth={3}
                                                            />
                                                            <span className="sr-only">
                                                                Next slide
                                                            </span>
                                                        </div>
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            )}
                            <div className="space-y-1 text-lg font-light md:text-xl">
                                {doc!.texts!.map((text, textIndex) => {
                                    if ("value" in text) {
                                        return (
                                            <p key={textIndex}>{text.value}</p>
                                        );
                                    } else {
                                        return (
                                            <div
                                                key={textIndex}
                                                className="space-y-2"
                                            >
                                                <h3>{text.title}</h3>
                                                <ul className="list-disc px-6">
                                                    {text.listItems.map(
                                                        (item) => (
                                                            <li key={item.id}>
                                                                {item.value}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {currentArticle?.footer && (
                    <p className="text-lg font-light md:text-2xl">
                        {currentArticle.footer}
                    </p>
                )}
            </div>
            <div className="hidden w-1/4 flex-col gap-10 border-l-2 border-[#40916C] px-4 py-4 md:flex xl:px-10">
                <div className="flex flex-col items-center gap-3">
                    <h3 className="text-center text-xl">
                        {t("latestArticlesEmail")}
                    </h3>
                    <MainButton className="text-wrap">
                        {t("subscribeNewsletter")}
                    </MainButton>
                </div>
                <div className="sticky top-20 w-full px-4">
                    <h2 className="mb-2 self-start text-xl lg:text-3xl">
                        {t("newestPosts")}
                    </h2>
                    <hr className="mb-4 w-full border border-black" />
                    <ScrollArea className="flex h-[75vh] w-full flex-col justify-center gap-2 transition-all delay-500 hover:delay-0">
                        <div className="w-full space-y-4">
                            {articles.slice(0, 6).map(
                                (article) =>
                                    article.id !== currentArticle!.id && (
                                        <a
                                            href={`/articles/${article.id}`}
                                            className="group flex h-36 w-full cursor-pointer flex-col items-start justify-center overflow-hidden rounded-lg border border-gray-300 lg:h-48"
                                            key={article.id}
                                        >
                                            <img
                                                src={article.heroImage}
                                                alt={article.title}
                                                className="h-full max-h-28 w-full  rounded-lg object-cover object-center transition-transform group-hover:scale-105 lg:max-h-40"
                                            />
                                            <div className="flex w-full items-center justify-between px-2 py-1 ">
                                                <h4 className="md:text-lg lg:text-xl">
                                                    {article.title}
                                                </h4>
                                                <div className="drop-shadow-lg">
                                                    <ChevronRight className="rounded-full border bg-white transition-all group-hover:bg-[#25BA9E] group-hover:text-white md:size-5 xl:size-6" />
                                                </div>
                                            </div>
                                        </a>
                                    ),
                            )}
                        </div>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </div>
            </div>
        </main>
    );
}
