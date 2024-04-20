"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase/config";
import { uploadImage } from "@/firebase/utils/upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { ChangeEvent, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import GradientButton from "../MainButton";
import { useAuth } from "../Providers";
import { useTranslations } from "next-intl";

const articlesFormSchema = z.object({
    title: z.string(),
    titleDesc: z.string().optional(),
    image: z.string().optional(),
    descriptions: z
        .array(
            z.object({
                descTitle: z.string().optional(),
                description: z.string().optional(),
            }),
        )
        .optional(),
    tables: z
        .array(
            z.object({
                tableTitle: z.string().optional(),
                tableItems: z.array(z.string()).optional(),
            }),
        )
        .optional(),
    footer: z.string().optional(),
});

type ArticleFormValues = z.infer<typeof articlesFormSchema>;

interface ArticleT extends ArticleFormValues {
    createdAt?: Timestamp;
    id?: number;
    creator: string;
    creatorImage: string;
    creatorUserName: string;
    approved: boolean;
}
export type { ArticleT };
export default function ArticlesSchema() {
    const t = useTranslations("Article.form");
    const [bValue, setBValue] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [submitImage, setSubmitImage] = useState("");
    const [submitValues, setSubmitValues] = useState<ArticleT>();
    const { user } = useAuth();

    const articlesForm = useForm<z.infer<typeof articlesFormSchema>>({
        resolver: zodResolver(articlesFormSchema),
        defaultValues: {
            title: "",
            titleDesc: "",
            image: "",
            descriptions: [{ descTitle: "", description: "" }],
            tables: [
                {
                    tableTitle: "",
                    tableItems: [],
                },
            ],
            footer: "",
        },
    });

    async function onSubmit(values: z.infer<typeof articlesFormSchema>) {
        const submitFormValues: ArticleT = {
            title: values.title,
            titleDesc: values.titleDesc,
            image:
                submitImage !== ""
                    ? `${submitImage}`
                    : "https://porositweb.com/wp-content/uploads/2019/11/krijo-nje-blog.jpg",
            descriptions: values.descriptions,
            tables: values.tables,
            footer: values.footer,
            createdAt: Timestamp.now(),
            id: Date.now(),
            creator: user.uid!,
            creatorImage: user.image!,
            creatorUserName: user.userName!,
            approved: user.admin ? true : false,
        };
        setSubmitValues(submitFormValues);
    }
    async function uploadContent() {
        setLoading(true);
        await setDoc(doc(db, "articles", `${submitValues!.id!}`), {
            title: submitValues!.title,
            titleDesc: submitValues!.titleDesc,
            descriptions: submitValues!.descriptions,
            image: submitValues!.image,
            tables: submitValues!.tables,
            footer: submitValues!.footer,
            createdAt: Timestamp.now(),
            id: submitValues!.id,
            creator: submitValues!.creator,
            creatorImage: submitValues!.creatorImage,
            creatorUserName: submitValues!.creatorUserName,
            approved: submitValues!.approved,
        });
        setLoading(false);
        setSubmitImage("");
        setSubmitValues(undefined);
        articlesForm.reset;
    }
    async function getImageData(event: ChangeEvent<HTMLInputElement>) {
        return await uploadImage(
            event.target.files![0],
            event.target.files![0].name,
        );
    }

    const { fields: descriptionFields, append: appendDesc } = useFieldArray({
        control: articlesForm.control,
        name: "descriptions",
    });
    const { fields: tableFields, append: appendTable } = useFieldArray({
        control: articlesForm.control,
        name: "tables",
    });

    return (
        <div className="h-fit w-full space-y-2 p-2 text-[#205041]">
            <Form {...articlesForm}>
                <form
                    onSubmitCapture={articlesForm.handleSubmit(onSubmit)}
                    className="flex h-full w-full flex-col justify-between space-y-2 p-6 text-left"
                >
                    <h3 className="text-4xl">{t("createNewArticle")}</h3>
                    <FormField
                        control={articlesForm.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("title")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("titlePlaceholder")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={articlesForm.control}
                        name="titleDesc"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("titleDescription")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("titleDescPlaceholder")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={articlesForm.control}
                        name="image"
                        render={() => (
                            <FormItem>
                                <FormLabel>{t("image")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        placeholder={t("imagePlaceholder")}
                                        onChangeCapture={async (event) => {
                                            setLoading(true);
                                            const res = await getImageData(
                                                event as ChangeEvent<HTMLInputElement>,
                                            );
                                            setSubmitImage(res);
                                            setLoading(false);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {descriptionFields.map((_, index) => (
                        <div key={index}>
                            <FormField
                                control={articlesForm.control}
                                key={`descriptions.${index}.descTitle`}
                                name={`descriptions.${index}.descTitle`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("descriptionTitle")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "descriptionTitlePlaceholder",
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={articlesForm.control}
                                key={`descriptions.${index}.description`}
                                name={`descriptions.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("description")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "descriptionPlaceholder",
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ))}
                    <GradientButton
                        onClick={() =>
                            appendDesc({ descTitle: "", description: "" })
                        }
                        className="w-fit border-2 border-[#25BA9E]"
                    >
                        {t("addMoreDescriptions")}
                    </GradientButton>

                    {tableFields.map((_, index) => (
                        <div key={index}>
                            <FormField
                                control={articlesForm.control}
                                key={`tables.${index}.tableTitle`}
                                name={`tables.${index}.tableTitle`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("tableTitle")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "tableTitlePlaceholder",
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={articlesForm.control}
                                key={`tables.${index}.tableItems`}
                                name={`tables.${index}.tableItems`}
                                render={({ field }) => (
                                    <>
                                        {field.value!.map(
                                            (_, tableItemIndex) => (
                                                <FormItem
                                                    key={`tables.${index}.tableItems.${tableItemIndex}`}
                                                >
                                                    <FormLabel>
                                                        {t("tableItem")}{" "}
                                                        {tableItemIndex + 1}:
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t(
                                                                "tableItemPlaceholder",
                                                            )}
                                                            onInput={(
                                                                event,
                                                            ) => {
                                                                field.value![
                                                                    tableItemIndex
                                                                ] = //@ts-ignore
                                                                    event.target.value;
                                                            }}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            ),
                                        )}
                                        <GradientButton
                                            className="mt-2 border-2 border-[#25BA9E]"
                                            key={index}
                                            onClick={() => {
                                                field.value!.push("");
                                                setBValue(!bValue);
                                            }}
                                        >
                                            {t("addMoreTableItems")}
                                        </GradientButton>
                                    </>
                                )}
                            />
                        </div>
                    ))}

                    <GradientButton
                        onClick={() =>
                            appendTable({
                                tableTitle: "",
                                tableItems: [""],
                            })
                        }
                        className="w-fit border-2 border-[#25BA9E]"
                    >
                        {t("addMoreTables")}
                    </GradientButton>
                    <FormField
                        control={articlesForm.control}
                        name="footer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("footer")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("footerPlaceholder")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="border-2 bg-[#25BA9E]"
                    >
                        {t("preview")}
                    </Button>
                </form>
            </Form>
            {submitValues && (
                <>
                    <h2 className="text-4xl">Preview article before upload:</h2>
                    <div className="flex flex-col rounded border border-black bg-white p-6">
                        <h2 className="mb-4 text-center text-7xl font-bold underline decoration-4">
                            {submitValues!.title}
                        </h2>
                        <h4 className="mb-2 text-center text-4xl">
                            {submitValues!.titleDesc!}
                        </h4>
                        <img
                            className="max-h-[81vh] w-full object-cover"
                            src={submitValues!.image!}
                            alt="article image"
                        />
                        <div className="px-4 pt-2">
                            {submitValues!.descriptions!.map(
                                (description, index) => (
                                    <div key={index} className="space-y-2">
                                        <h4 className="text-4xl">
                                            {description.descTitle}
                                        </h4>
                                        <p className="px-2 text-xl">
                                            {description.description}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                        <div className="p-4">
                            {submitValues!.tables!.map((table, tableIndex) => (
                                <>
                                    <h5 className="text-3xl">
                                        {table.tableTitle}
                                    </h5>
                                    <ul
                                        key={tableIndex}
                                        className="list-decimal px-10 py-2 text-lg"
                                    >
                                        {table.tableItems!.map(
                                            (item, listIndex) => (
                                                <li key={listIndex}>{item}</li>
                                            ),
                                        )}
                                    </ul>
                                </>
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
