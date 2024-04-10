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
import {
    Timestamp,
    collection,
    deleteDoc,
    doc,
    getDocs,
    setDoc,
} from "firebase/firestore";
import {
    ChangeEvent,
    useEffect,
    useState
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import GradientButton from "../MainButton";

const articlesFormSchema = z.object({
    title: z.string(),
    titleDesc: z.string().optional(),
    image: z.string().optional(),
    descriptions: z.array(
        z.object({ descTitle: z.string().optional(), description: z.string().optional() }),
    ),
    tables: z
        .array(
            z.object({
                tableTitle: z.string().optional(),
                tableItems: z.array(z.string()).optional(),
            }),
        )
        .optional(),
        footer:z.string().optional(),
});

type ArticleFormValues = z.infer<typeof articlesFormSchema>;

interface ArticleT extends ArticleFormValues{
    createdAt?:Timestamp;
    id?:number;
}
export type {ArticleT}
export default function ArticlesAdmin() {
    const [bValue, setBValue] = useState(false);
    const [uploadedArticles, setUploadedArticles] =
        useState<ArticleT[]>();
    const [isLoading, setLoading] = useState(false);
    const [submitImage, setSubmitImage] = useState("");
    const [submitValues, setSubmitValues] = useState<ArticleT>({
        title: "",
        titleDesc:"",
        image: "",
        descriptions: [{ descTitle: "", description: "" }],
        tables: [{ tableTitle: "", tableItems: [""] }],
        footer:"",
        id:undefined,
        createdAt:undefined,
    });

    useEffect(() => {
        const fetchUploadedContent = async () => {
            const querySnapshot = await getDocs(collection(db, "articles"));
            const content: any = [];
            querySnapshot.forEach((doc) => {
                content.push({
                    id: doc.id,
                    title: doc.data().title!,
                    image: doc.data().image!,
                });
            });
            setUploadedArticles(content);
        };
        fetchUploadedContent();
    }, []);

    async function deleteArticle(id: number) {
        await deleteDoc(doc(db, "articles", `${id}`));
    }

    const articlesForm = useForm<z.infer<typeof articlesFormSchema>>({
        resolver: zodResolver(articlesFormSchema),
        defaultValues: {
            title: "",
            titleDesc:"",
            image: "",
            descriptions: [{ descTitle: "", description: "" }],
            tables: [
                {
                    tableTitle: "",
                    tableItems: [],
                },
            ],
            footer:"",
        },
    });

    async function onSubmit(values: z.infer<typeof articlesFormSchema>) {
        const submitFormValues:ArticleT = {
            title: values.title,
            titleDesc:values.titleDesc,
            image:
                submitImage !== ""
                    ? `${submitImage}`
                    : "https://porositweb.com/wp-content/uploads/2019/11/krijo-nje-blog.jpg",
            descriptions: values.descriptions,
            tables: values.tables,
            footer:values.footer,
            createdAt: Timestamp.now(),
            id: Date.now(),
        };
        setSubmitValues(submitFormValues);
    }
    async function uploadContent() {
        setLoading(true);
        await setDoc(doc(db, "articles",`${submitValues!.id!}` ), {
            title: submitValues.title,
            titleDesc:submitValues.titleDesc,
            descriptions: submitValues.descriptions,
            image: submitValues.image,
            tables: submitValues.tables,
            footer:submitValues.footer,
            createdAt: Timestamp.now(),
            id:submitValues.id,
        });
        setLoading(false);
        setSubmitImage("");
        setSubmitValues({
            title: "",
            titleDesc:"",
            image: "",
            descriptions: [{ descTitle: "", description: "" }],
            tables: [{ tableTitle: "", tableItems: [] }],
            footer:"",
        });
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
        <div className="h-fit w-full space-y-2 rounded border p-2 text-[#205041]">
            <h1 className="text-center text-6xl">Articles:</h1>
            <Form {...articlesForm}>
                <form
                    onSubmitCapture={articlesForm.handleSubmit(onSubmit)}
                    className="flex h-full w-full flex-col justify-between space-y-2 p-6 text-left "
                >
                    <h3 className="text-4xl">Create new article:</h3>
                    <FormField
                        control={articlesForm.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title:</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter articles title here..."
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
                                <FormLabel>Title description:</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter articles title description here..."
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
                                <FormLabel>Image:</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        placeholder="Place your image here..."
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
                                            Description title:
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter news description here..."
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
                                        <FormLabel>Description:</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter news description here..."
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
                        className="w-1/2 border-[#25BA9E] border-2"
                    >
                        Add more descriptions
                    </GradientButton>

                    {tableFields.map((_, index) => (
                        <div key={index}>
                            <FormField
                                control={articlesForm.control}
                                key={`tables.${index}.tableTitle`}
                                name={`tables.${index}.tableTitle`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Table title:</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter articles table title here..."
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
                                                        Table Item{" "}
                                                        {tableItemIndex + 1}:
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter articles table item here..."
                                                            //@ts-ignore
                                                            onInput={(event,) => {field.value[tableItemIndex] =event.target.value;}}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            ),
                                        )}
                                        <GradientButton
                                          className="w-1/3 border-[#25BA9E] border-2 mt-2"
                                            key={index}
                                            onClick={() => {
                                                field.value!.push("");
                                                setBValue(!bValue);
                                            }}
                                        >
                                            Add more table items
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
                        className="w-1/2 border-[#25BA9E] border-2"
                    >
                        Add more tables
                    </GradientButton>
                    <FormField
                        control={articlesForm.control}
                        name="footer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Footer:</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter articles footer here..."
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
                        className="bg-[#25BA9E] border-2"
                    >
                        Preview
                    </Button>
                </form>
            </Form>
            {submitValues.title !== "" && (
                <>
                    <h2 className="text-4xl">Preview article before upload:</h2>
                    <div className="flex flex-col rounded border border-black bg-white p-6">
                        <h2 className="mb-4 text-center text-7xl font-bold underline decoration-4">
                            {submitValues.title}
                        </h2>
                        <h4 className="text-center text-4xl mb-2">{submitValues.titleDesc!}</h4>
                        <img
                            className="max-h-[81vh] w-full object-cover"
                            src={submitValues.image!}
                            alt="article image"
                        />
                        <div className="px-4 pt-2">
                            {submitValues.descriptions!.map(
                                (description, index) => (
                                    <div key={index} className="space-y-2">
                                        <h4 className="text-4xl">
                                            {description.descTitle}
                                        </h4>
                                        <p className="px-2 text-xl">{description.description}</p>
                                    </div>
                                ),
                            )}
                        </div>
                        <div className="p-4">
                            {submitValues.tables!.map((table, tableIndex) => (
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
                        <h5>{submitValues.footer!}</h5>
                        <Button type="button" onClick={uploadContent}>
                            Upload
                        </Button>
                    </div>
                </>
            )}

            <div className="h-fit w-full rounded border border-black">
                <h2 className="text-4xl">Delete articles:</h2>
                {uploadedArticles?.map((article, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center gap-1 p-3 sm:w-1/2 md:w-1/3"
                    >
                        <div className=" flex flex-col items-center justify-center gap-2">
                            <h2 className="text-4xl ">{article.title}</h2>
                            <img src={article.image} />
                        </div>
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() => {
                                deleteArticle(article.id!);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}