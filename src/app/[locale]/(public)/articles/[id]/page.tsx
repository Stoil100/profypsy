"use client";
import MainButton from "@/components/MainButton";
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
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

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
    const t = useTranslations("Article.id");
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

    const scrollTo = useCallback(
        (index: number) => {
            if (!api) return;
            api.scrollTo(index);
        },
        [api],
    );
    return (
        <main className="flex h-fit w-full pb-4 pt-20">
            <div className="flex w-full flex-col gap-4 p-3 text-[#205041] md:w-3/4 md:p-8">
                <h2 className="text-center text-4xl font-bold">
                    {currentArticle?.title}
                </h2>
                <img
                    src={currentArticle?.heroImage}
                    alt={currentArticle?.title}
                    className="self-center"
                />
                <div className="space-y-4 px-2">
                    {currentArticle?.descriptions!.map((desc) => (
                        <p className="px-4 text-lg" key={desc.id}>
                            {desc.value}
                        </p>
                    ))}
                </div>
            </div>
            <div className="max-w-2xl space-y-6 md:w-3/4 md:p-8">
                <h1 className="text-5xl">{currentArticle!.title}</h1>
                <div className="space-y-2 px-2">
                    {currentArticle!.titleDescriptions!.map((desc, index) => (
                        <p key={index} className="text-xl font-light">
                            {desc.value}
                        </p>
                    ))}
                </div>
                <img
                    src={currentArticle!.heroImage}
                    alt={currentArticle!.title}
                    className="w-full rounded-2xl"
                />
                <div className="space-y-6 text-2xl font-light">
                    {currentArticle!.descriptions!.map((desc, index) => (
                        <p key={index}>{desc.value}</p>
                    ))}
                </div>
                {currentArticle!.lists!.map((list, listIndex) => (
                    <div
                        key={listIndex}
                        className="space-y-2 text-2xl font-light"
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
                            <h2 className="text-4xl">{doc.title}</h2>
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
                                    className="flex w-full cursor-pointer gap-2"
                                    onClick={() => {
                                        setActiveIndex(docIndex);
                                        setOpen(true);
                                    }}
                                >
                                    <img
                                        src={doc!.images![0].value}
                                        alt={`Doc ${docIndex} Image 0`}
                                        className="w-3/4 rounded-2xl"
                                    />
                                    <div
                                        className={cn(
                                            "flex w-full gap-2",
                                            docIndex % 2 === 0
                                                ? "flex-col-reverse"
                                                : "flex-col",
                                        )}
                                    >
                                        <p className="flex aspect-square w-full items-center justify-center rounded-2xl border text-center text-5xl">
                                            {doc!.images!.length - 2}+
                                        </p>
                                        <img
                                            src={doc!.images![1].value}
                                            className="h-full rounded-2xl object-cover"
                                        />
                                    </div>
                                    {activeIndex !== undefined && (
                                        <Dialog
                                            open={open}
                                            onOpenChange={setOpen}
                                        >
                                            <DialogContent className="max-w-screen z-[999999] flex h-full max-h-screen flex-col items-center justify-center border-none bg-black/80 md:p-8">
                                                <DialogTitle className="sr-only text-2xl font-light text-white">
                                                    {
                                                        currentArticle!.docs![
                                                            activeIndex
                                                        ].title
                                                    }
                                                </DialogTitle>
                                                <Carousel
                                                    className="max-w-3xl 2xl:max-w-7xl"
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
                                                                    className=""
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
                                                    <CarouselNext className="border-green bg-green hover:text-green hidden text-white hover:bg-transparent lg:flex" />
                                                    <CarouselPrevious className="border-green bg-green hover:text-green hidden text-white hover:bg-transparent lg:flex" />
                                                </Carousel>
                                                <ScrollArea className="min-h-fit whitespace-nowrap max-sm:hidden">
                                                    <div className="flex justify-center gap-8 p-4 2xl:gap-16">
                                                        {currentArticle!.docs![
                                                            activeIndex
                                                        ].images!.map(
                                                            (image, index) => (
                                                                <div
                                                                    key={index}
                                                                    className={cn(
                                                                        "aspect-video h-max min-w-48 cursor-pointer rounded-xl bg-cover bg-center transition-transform",
                                                                        index ===
                                                                            api?.selectedScrollSnap() &&
                                                                            "scale-105 md:scale-110",
                                                                    )}
                                                                    style={{
                                                                        backgroundImage: `url('${image.value}')`,
                                                                    }}
                                                                    onClick={() => {
                                                                        scrollTo(
                                                                            index,
                                                                        );
                                                                    }}
                                                                />
                                                            ),
                                                        )}
                                                    </div>
                                                    <ScrollBar orientation="horizontal" />
                                                </ScrollArea>
                                                <div className="flex gap-4 sm:hidden">
                                                    <MainButton
                                                        className="size-10"
                                                        onClick={() => {
                                                            api?.scrollPrev();
                                                        }}
                                                    >
                                                        <ArrowLeft />
                                                    </MainButton>
                                                    <MainButton
                                                        className="size-10"
                                                        onClick={() => {
                                                            api?.scrollNext();
                                                        }}
                                                    >
                                                        <ArrowRight />
                                                    </MainButton>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>
                            )}
                            <div className="space-y-1 text-xl font-light">
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
            </div>
            <div className="hidden w-1/4 flex-col items-center gap-10 border-l-2 border-black pt-20 md:flex">
                <div className="flex w-1/2 flex-col items-center gap-3">
                    <h3 className="text-center text-xl">
                        {t("latestArticlesEmail")}
                    </h3>
                    <MainButton>{t("subscribeNewsletter")}</MainButton>
                </div>
                <div className="sticky top-20 flex w-2/3 flex-col items-center justify-center gap-2">
                    <h2 className="self-start text-3xl">{t("newestPosts")}</h2>
                    <hr className="w-full border border-black" />
                    <div className="space-y-4 pt-4">
                        {articles.slice(0, 6).map((article) => (
                            <div
                                className="flex cursor-pointer flex-col items-start justify-center gap-4 transition-transform hover:scale-105"
                                key={article.id}
                            >
                                <img
                                    src={article.heroImage}
                                    alt={article.title}
                                    className="h-auto w-full rounded-xl"
                                />
                                <h4 className="text-xl">{article.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
