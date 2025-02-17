"use client";

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
import { cn } from "@/lib/utils";
import type { ArticleT } from "@/models/article";
import { ArrowLeft, ArrowRight, ChevronRightIcon } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

type ArticleDialogProps = {
    article: ArticleT | undefined;
    setPreviewArticle: React.Dispatch<
        React.SetStateAction<ArticleT | undefined>
    >;
};

export const ArticleDialog: React.FC<ArticleDialogProps> = ({
    article,
    setPreviewArticle,
}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [api, setApi] = useState<CarouselApi>();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!api) return;
        api.on("select", () => {
            setActiveIndex(api.selectedScrollSnap());
        });
    }, [api]);

    if (!article) return null;

    return (
        <Dialog
            open={article !== undefined}
            onOpenChange={() => {
                setPreviewArticle(undefined);
            }}
        >
            <DialogContent className="top-0 z-[9999] mt-[--nav-height]  max-h-screen translate-y-0 overflow-y-auto !rounded-none border-none bg-black/50 text-white backdrop-blur-sm">
                <div className="w-full space-y-6 p-2 md:p-8">
                    <h1 className="text-3xl md:text-5xl">{article!.title}</h1>
                    <div className="space-y-2 px-2">
                        {article!.titleDescriptions!.map((desc, index) => (
                            <p
                                key={index}
                                className="text-md font-light md:text-xl"
                            >
                                {desc.value}
                            </p>
                        ))}
                    </div>
                    <img
                        src={article!.heroImage}
                        alt={article!.title}
                        className="w-full"
                    />
                    <div className="space-y-2 text-lg font-light md:space-y-6 md:text-2xl">
                        {article!.descriptions!.map((desc, index) => (
                            <p key={index}>{desc.value}</p>
                        ))}
                    </div>
                    {article!.lists!.map((list, listIndex) => (
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
                        {article!.docs!.map((doc, docIndex) => (
                            <div key={docIndex} className="space-y-4">
                                <h2 className="text-2xl md:text-4xl">
                                    {doc.title}
                                </h2>
                                {doc!.images!.length <= 2 ? (
                                    <div className="flex gap-2">
                                        {doc!.images!.map(
                                            (image, imageIndex) => (
                                                <img
                                                    key={imageIndex}
                                                    src={image.value}
                                                    alt={`Doc ${docIndex} Image ${imageIndex}`}
                                                />
                                            ),
                                        )}
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
                                                <ChevronRightIcon />
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
                                                            article!.docs![
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
                                                            {article!.docs![
                                                                activeIndex
                                                            ].images!.map(
                                                                (
                                                                    image,
                                                                    index,
                                                                ) => (
                                                                    <CarouselItem
                                                                        key={
                                                                            index
                                                                        }
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
                                                                    strokeWidth={
                                                                        3
                                                                    }
                                                                />
                                                                <span className="sr-only">
                                                                    Previous
                                                                    slide
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
                                                                    strokeWidth={
                                                                        3
                                                                    }
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
                                                <p key={textIndex}>
                                                    {text.value}
                                                </p>
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
                                                                <li
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >
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
            </DialogContent>
        </Dialog>
    );
};
