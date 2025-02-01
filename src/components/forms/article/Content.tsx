"use client";

import MainButton from "@/components/MainButton";
import { useAuth } from "@/components/Providers";
import { ArticlesSchema } from "@/components/schemas/article";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { db } from "@/firebase/config";
import { uploadImage } from "@/firebase/utils/upload";
import { cn } from "@/lib/utils";
import { ArticleT } from "@/models/article";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Descriptions } from "./Descriptions";
import { Docs } from "./Docs";
import { Lists } from "./Lists";
import { TitleDescriptions } from "./TitleDescriptions";

export function ArticleForm() {
    const t = useTranslations("Pages.Article.form");
    const { user } = useAuth();
    const formSchema = ArticlesSchema(t);
    const [submitValues, setSubmitValues] = useState<ArticleT>();
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
    type FormValues = z.infer<typeof formSchema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    async function onSubmit(values: FormValues) {
        const submitFormValues: ArticleT = {
            ...values,
            createdAt: Timestamp.now(),
            creator: user.uid!,
            creatorImage: user.image!,
            creatorUserName: user.userName!,
            approved: user.admin ? true : false,
        };
        setSubmitValues(submitFormValues);
    }
    async function uploadContent() {
        await addDoc(collection(db, "articles"), {
            ...submitValues,
        });
        setSubmitValues(undefined);
        form.reset();
    }
    async function getImageData(event: ChangeEvent<HTMLInputElement>) {
        return await uploadImage(
            event.target.files![0],
            event.target.files![0].name,
        );
    }
    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 px-1"
                >
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("title")}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="heroImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("heroImage")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChangeCapture={async (event) => {
                                            const res = await getImageData(
                                                event as ChangeEvent<HTMLInputElement>,
                                            );
                                            form.setValue(field.name, res);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <TitleDescriptions
                        control={form.control}
                        name="titleDescriptions"
                        t={(key) => t(`titleDescriptions.${key}`)}
                    />

                    <Descriptions
                        control={form.control}
                        name="descriptions"
                        t={(key) => t(`descriptions.${key}`)}
                    />

                    <Lists
                        control={form.control}
                        name="lists"
                        t={(key) => t(`lists.${key}`)}
                    />

                    <Docs
                        control={form.control}
                        setValue={form.setValue}
                        name="docs"
                        t={(key) => t(`docs.${key}`)}
                    />

                    <FormField
                        control={form.control}
                        name="footer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("footer.label")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("footer.placeholder")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("type.label")}</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="standard" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t("type.options.standard")}
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="notable" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t("type.options.notable")}
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="important" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t("type.options.important")}
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <MainButton className="w-full" type="submit">
                        {t("submit")}
                    </MainButton>
                </form>
            </Form>
            {submitValues && (
                <>
                    <h2 className="mt-4 text-4xl">{t("preview")}</h2>
                    <div className="flex flex-col bg-white p-6">
                        <h2 className="mb-4 text-center text-7xl font-bold underline decoration-4">
                            {submitValues!.title}
                        </h2>
                        {submitValues!.titleDescriptions!.map(
                            (titleDescription) => (
                                <h4
                                    key={titleDescription.id}
                                    className="mb-2 text-center text-2xl"
                                >
                                    {titleDescription.value}
                                </h4>
                            ),
                        )}
                        <img
                            className="max-h-[81vh] w-full object-cover"
                            src={submitValues!.heroImage!}
                            alt="article image"
                        />
                        {submitValues!.descriptions!.map((description) => (
                            <p key={description.id} className="px-2 text-xl">
                                {description.value}
                            </p>
                        ))}
                        <div className="p-4">
                            {submitValues!.lists!.map((list, listIndex) => (
                                <>
                                    <h5 key={listIndex} className="text-3xl">
                                        {list.title}
                                    </h5>
                                    <ul
                                        key={listIndex}
                                        className="list-decimal px-10 py-2 text-lg"
                                    >
                                        {list.items!.map((item) => (
                                            <li key={item.id}>{item.value}</li>
                                        ))}
                                    </ul>
                                </>
                            ))}
                        </div>
                        <div>
                            {submitValues!.docs!.map((doc, docIndex) => (
                                <div key={docIndex} className="space-y-4">
                                    <h2 className="text-4xl">{doc.title}</h2>
                                    {doc!.images!.length <= 2 ? (
                                        <div className="flex items-center justify-center gap-2">
                                            {doc!.images!.map(
                                                (image, imageIndex) => (
                                                    <img
                                                        key={imageIndex}
                                                        src={image.value}
                                                        alt={`Doc ${docIndex} Image ${imageIndex}`}
                                                        className="object-fill"
                                                    />
                                                ),
                                            )}
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
                                                                submitValues!
                                                                    .docs![
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
                                                                watchDrag:
                                                                    false,
                                                                loop: true,
                                                            }}
                                                        >
                                                            <CarouselContent className="-ml-4">
                                                                {submitValues!.docs![
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
                                                                {submitValues!.docs![
                                                                    activeIndex
                                                                ].images!.map(
                                                                    (
                                                                        image,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
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
                                                                        {
                                                                            item.value
                                                                        }
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
                        <h5>{submitValues!.footer!}</h5>
                        <Button type="button" onClick={uploadContent}>
                            Upload
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
