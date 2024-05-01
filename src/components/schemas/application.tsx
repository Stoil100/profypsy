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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/firebase/config";
import { uploadImage } from "@/firebase/utils/upload";
import { cn } from "@/lib/utils";
import { PsychologistT } from "@/models/psychologist";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { FirestoreError, doc, setDoc, updateDoc } from "firebase/firestore";
import {
    Briefcase,
    GraduationCap,
    Info,
    Medal,
    Tag,
    UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";
import { useAuth } from "../Providers";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import { useTranslations } from "next-intl";

type LanguageT = {
    icon: ReactNode;
    language: string;
};

type Props = {
    className: string;
};
export default function ApplicationForm({ className }: Props) {
    const t = useTranslations("Auth.application");
    const languageOptions: LanguageT[] = [
        {
            icon: <img src="/logic/bg.png" />,
            language: t("languages.bulgarian"),
        },
        {
            icon: <img src="/logic/en.png" />,
            language: t("languages.english"),
        },
    ];
    const specializationOptions = [
        {
            specialization: t("specializations.you"),
        },
        {
            specialization: t("specializations.couples"),
        },
        {
            specialization: t("specializations.families"),
        },
    ];
    const dateOptions = [
        { id: "monday", label: t("dates.monday") },
        { id: "tuesday", label: t("dates.tuesday") },
        { id: "wednesday", label: t("dates.wednesday") },
        { id: "thursday", label: t("dates.thursday") },
        { id: "friday", label: t("dates.friday") },
        { id: "saturday", label: t("dates.saturday") },
        { id: "sunday", label: t("dates.sunday") },
    ];
    const formSchema = z.object({
        phone: z
            .string()
            .regex(
                /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
                t("formSchemaErrors.invalidPhoneNumber"),
            ),
        age: z.string().min(1, t("formSchemaErrors.selectAge")),
        about: z
            .string()
            .min(10, t("formSchemaErrors.shortDescription"))
            .max(500, t("formSchemaErrors.longDescription")),
        quote: z
            .string()
            .min(5, t("formSchemaErrors.shortQuote"))
            .max(100, t("formSchemaErrors.longQuote")),
        image: z.any().optional(),
        cv: z
            .any()
            .refine((file) => file?.length == 1, t("formSchemaErrors.validCV")),
        letter: z
            .any()
            .refine(
                (file) => file?.length == 1,
                t("formSchemaErrors.validLetter"),
            ),
        diploma: z
            .any()
            .refine(
                (file) => file?.length == 1,
                t("formSchemaErrors.validDiploma"),
            ),
        cost: z.object({
            dates: z
                .array(z.string())
                .refine((value) => value.some((item) => item), {
                    message: t("formSchemaErrors.selectAtLeastOneDate"),
                }),
            price: z.string().min(1, t("formSchemaErrors.selectPricePerHour")),
        }),
        educations: z.array(
            z.object({
                education: z
                    .string()
                    .min(1, t("formSchemaErrors.validEducation")),
            }),
        ),
        experiences: z.array(
            z.object({
                experience: z
                    .string()
                    .min(1, t("formSchemaErrors.validExperience")),
            }),
        ),
        userName: z.string().min(3, t("formSchemaErrors.validName")),
        location: z
            .string()
            .min(1, t("formSchemaErrors.validCity"))
            .max(60, t("formSchemaErrors.cityCharacterLimit")),
        specializations: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: t("formSchemaErrors.selectAtLeastOneSpecialization"),
            }),
        languages: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: t("formSchemaErrors.selectAtLeastOneLanguage"),
            }),
    });
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!user.uid) {
            router.push("/login");
        } else if (user.role == "psychologist") {
            router.push(`/profile`);
        }
    }, []);
    const [tab, setTab] = useState("info");
    const [submitImage, setSubmitImage] = useState(user.image);
    const [submitCV, setSubmitCV] = useState("");
    const [submitDiploma, setSubmitDiploma] = useState("");
    const [submitLetter, setSubmitLetter] = useState("");
    const [selectedSubscription, setSelectedSubscription] = useState<
        "Basic" | "Premium" | "Deluxe"
    >("Premium");
    // const [isPaying, setIsPaying] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: user.userName!,
            phone: user.phone!,
            about: "",
            image: user.image!,
            cost: {
                dates: ["saturday", "sunday"],
                price: "",
            },
            educations: [{ education: "" }],
            experiences: [{ experience: "" }],
            location: "",
            specializations: [],
            cv: undefined,
            diploma: undefined,
            letter: undefined,
            languages: [],
            age: "18",
        },
    });
    const imageRef = form.register("image", { required: false });
    const cvRef = form.register("cv", { required: true });
    const letterRef = form.register("letter", { required: true });
    const diplomaRef = form.register("diploma", { required: true });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (!user) return; // Additional user validation could be added here

        const tempValues: PsychologistT = {
            ...values,
            image: submitImage,
            email: user.email!,
            appointments: user.appointments!,
            cv: submitCV,
            diploma: submitDiploma,
            letter: submitLetter,
            variant: selectedSubscription,
            duration: "Monthly",
            rating: -1,
            trial: true,
            approved: false,
            uid: user.uid!,
        };
        submitData(tempValues);
    };
    const submitData = async (values: PsychologistT) => {
        if (user.uid) {
            try {
                await setDoc(doc(db, "psychologists", user.uid!), values);
                await updateDoc(doc(db, "users", user.uid), {
                    role: "psychologist"
                });
                toast({
                    title: t("upload.thanksForApplyingTitle"),
                    description: t("upload.thanksForApplyingDescription", {
                        email: values.email,
                    }),
                });
                router.push(`/profile`);
            } catch (error) {
                const firestoreError = error as FirestoreError;
                toast({
                    title: t("upload.errorUploadingDocumentTitle"),
                    description: `${firestoreError.message}`,
                });
                router.push("/");
            }
        }
    };
    async function getImageData(event: ChangeEvent<HTMLInputElement>) {
        return await uploadImage(
            event.target.files![0],
            event.target.files![0].name,
        );
    }
    const {
        fields: educationFields,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({
        control: form.control,
        name: "educations",
    });
    const {
        fields: experienceFields,
        append: appendExperience,
        remove: removeExperience,
    } = useFieldArray({
        control: form.control,
        name: "experiences",
    });
    type SubsriptionOptionVariant = {
        variant: "Basic" | "Premium" | "Deluxe";
        type: "Monthly" | "Yearly";
    };
    const SubscriptionOption: React.FC<SubsriptionOptionVariant> = ({
        variant,
        type,
    }) => {
        const mainColor =
            variant === "Basic"
                ? "#FC8A6A"
                : variant === "Premium"
                  ? "#25BA9E"
                  : "#9747FF";

        return (
            <div
                className={cn(
                    "w-[250px] space-y-2 rounded-3xl px-6 py-3 shadow-xl",
                    `hover:border-2 border-[${mainColor}]`,
                    selectedSubscription === variant &&
                        `border-2 border-[${mainColor}]`,
                )}
            >
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            "h-fit w-fit rounded-full border-2 p-2",
                            `border-[${mainColor}] text-[${mainColor}]`,
                        )}
                    >
                        {variant === "Basic" ? (
                            <Tag />
                        ) : variant === "Premium" ? (
                            <Briefcase />
                        ) : (
                            <Medal />
                        )}
                    </div>
                    <h2 className="text-xl font-bold">{variant}</h2>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="term-1"
                            checked
                            disabled
                            className="border-[#25BA9E] !bg-white !text-[#25BA9E] !opacity-100"
                        />
                        <label
                            htmlFor="term-1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Accept terms and conditions
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="term-2"
                            checked
                            disabled
                            className="border-[#25BA9E] !bg-white !text-[#25BA9E] !opacity-100"
                        />
                        <label
                            htmlFor="term-2"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Accept terms and conditions
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="term-1"
                            checked={
                                variant === "Premium" || variant === "Deluxe"
                            }
                            disabled
                            className={cn(
                                "!bg-white !opacity-100",
                                variant === "Premium" || variant === "Deluxe"
                                    ? "border-[#25BA9E] !text-[#25BA9E]"
                                    : "border-[#FF5B2E]",
                            )}
                        />
                        <label
                            htmlFor="term-1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Accept terms and conditions
                        </label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="term-1"
                            checked={variant === "Deluxe"}
                            disabled
                            className={cn(
                                "!bg-white !opacity-100",
                                variant === "Deluxe"
                                    ? "border-[#25BA9E] !text-[#25BA9E]"
                                    : "border-[#FF5B2E]",
                            )}
                        />
                        <label
                            htmlFor="term-1"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Accept terms and conditions
                        </label>
                    </div>
                </div>
                <div className="flex flex-col items-center px-6">
                    <h2 className={cn("text-3xl", `text-[${mainColor}]`)}>
                        {type === "Monthly" ? "$42.50" : "$500"}
                    </h2>
                    <p className="text-sm text-gray-400">Yearly: Save 15%</p>
                    {type === "Monthly" && (
                        <p
                            className={cn(
                                "self-end text-sm",
                                `text-[${mainColor}]`,
                            )}
                        >
                            $50
                        </p>
                    )}
                </div>
                <div className="flex w-full justify-center">
                    <Button
                        variant={
                            selectedSubscription === variant
                                ? "default"
                                : "outline"
                        }
                        onClick={() => {
                            setSelectedSubscription(variant);
                        }}
                        className={cn(
                            "rounded-xl border-2 transition-transform hover:scale-110",
                            `border-[${mainColor}] text-[${mainColor}] hover:text-[${mainColor}]`,
                            selectedSubscription === variant &&
                                `bg-[${mainColor}] text-white hover:bg-[${mainColor}]`,
                        )}
                    >
                        {selectedSubscription === variant
                            ? "Selected"
                            : "Choose"}
                    </Button>
                </div>
            </div>
        );
    };
    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn(
                        "z-10 w-full space-y-8 rounded-xl border-[#525174] bg-white py-2",
                        className,
                    )}
                >
                    <Tabs
                        defaultValue="info"
                        value={tab}
                        className="w-full px-3 sm:px-6"
                    >
                        <TabsList className="h-fit w-full space-x-2 text-[#09243E]">
                            <TabsTrigger
                                value="info"
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 sm:flex-row",
                                    tab === "info" &&
                                        "rounded-full !bg-[#25BA9E99] !text-white",
                                )}
                                onClick={() => {
                                    setTab("info");
                                }}
                            >
                                <Info className="size-8 md:size-6" />
                                <p className="hidden md:block">
                                    {t("form.tabs.info")}
                                </p>
                            </TabsTrigger>
                            <TabsTrigger
                                value="education"
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 sm:flex-row",
                                    tab === "education" &&
                                        "rounded-full !bg-[#25BA9E80] !text-white",
                                )}
                                onClick={() => {
                                    setTab("education");
                                }}
                            >
                                <GraduationCap className="size-8 sm:size-6" />
                                <p className="hidden md:block">
                                    {t("form.tabs.education")}
                                </p>
                            </TabsTrigger>
                            <TabsTrigger
                                value="experience"
                                className={cn(
                                    "flex flex-col items-center justify-center gap-2 sm:flex-row",
                                    tab === "experience" &&
                                        "rounded-full !bg-[#25BA9E80] !text-white",
                                )}
                                onClick={() => {
                                    setTab("experience");
                                }}
                            >
                                <Briefcase className="size-8 sm:size-6" />
                                <p className="hidden md:block">
                                    {t("form.tabs.experience")}
                                </p>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="info" className="space-y-4">
                            <div className="relative flex items-center justify-center">
                                {submitImage ? (
                                    <img
                                        src={submitImage!}
                                        className="absolute -z-10 size-[150px] rounded-full"
                                    />
                                ) : (
                                    <UserRound
                                        className="absolute -z-10"
                                        size={50}
                                    />
                                )}
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="image/png, image/jpg, image/jpeg, image/webp"
                                                    {...imageRef}
                                                    className={cn(
                                                        "size-[150px] rounded-full border-2 border-dashed border-black bg-transparent text-transparent file:text-transparent",
                                                        submitImage === ""
                                                            ? "border-dashed"
                                                            : "border-solid",
                                                    )}
                                                    onChangeCapture={async (
                                                        event,
                                                    ) => {
                                                        const res =
                                                            await getImageData(
                                                                event as ChangeEvent<HTMLInputElement>,
                                                            );
                                                        setSubmitImage(res);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            {t("form.userName.label")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "form.userName.placeholder",
                                                )}
                                                {...field}
                                                className="rounded-2xl border-2 border-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex w-full items-end justify-center gap-2">
                                <div className="w-full">
                                    <Label>{t("form.telephone.label")}</Label>
                                    <div className="flex items-center justify-center rounded-full border-2 border-black px-2">
                                        <img
                                            src="/logic/bg.png"
                                            className="h-8"
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem className="w-full ">
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t(
                                                                "form.telephone.placeholder",
                                                            )}
                                                            {...field}
                                                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="age"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>
                                                {t("form.age.label")}
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={`${field.value}`}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full rounded-xl border-2 border-black text-xl">
                                                        <SelectValue
                                                            placeholder={t(
                                                                "form.age.placeholder",
                                                            )}
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            {t(
                                                                "form.age.placeholder",
                                                            )}
                                                        </SelectLabel>
                                                        {Array.from({
                                                            length: 100,
                                                        }).map((_, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={`${index + 18}`}
                                                            >
                                                                {index + 18}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            {t("form.location.label")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "form.location.placeholder",
                                                )}
                                                {...field}
                                                className="rounded-2xl border-2 border-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="about"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            {t("form.about.label")}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t(
                                                    "form.about.placeholder",
                                                )}
                                                {...field}
                                                className="rounded-2xl border-2 border-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="quote"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            {t("form.quote.label")}
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t(
                                                    "form.quote.placeholder",
                                                )}
                                                {...field}
                                                className="rounded-2xl border-2 border-black"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2 rounded-3xl border-2 border-black p-4">
                                <h2 className="text-xl">{t("form.cv")}</h2>
                                <hr className="w-full border-2 border-black" />
                                <div className="relative h-fit">
                                    {submitCV ? (
                                        <embed
                                            src={submitCV}
                                            className="absolute left-1/2 top-0 -z-10  h-[150px] -translate-x-1/2 "
                                        />
                                    ) : (
                                        <div className="absolute left-0 top-0 -z-10 flex h-[150px] w-full flex-col items-center justify-center">
                                            <img
                                                src="/auth/upload.png"
                                                className="h-20"
                                            />
                                            <p>
                                                {t("form.dragDrop.text")}{" "}
                                                <span className="text-[#25BA9E]">
                                                    {t(
                                                        "form.dragDrop.description",
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                    <FormField
                                        control={form.control}
                                        name="cv"
                                        render={({ field }) => (
                                            <FormItem className="h-fit w-full">
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        {...cvRef}
                                                        className="h-[150px] rounded-2xl border-2 border-dashed border-black bg-transparent text-transparent file:text-transparent"
                                                        onChangeCapture={async (
                                                            event,
                                                        ) => {
                                                            const res =
                                                                await getImageData(
                                                                    event as ChangeEvent<HTMLInputElement>,
                                                                );

                                                            setSubmitCV(res);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex w-full items-center gap-2">
                                <FormField
                                    control={form.control}
                                    name="languages"
                                    render={(field) => (
                                        <div className="flex h-full w-full flex-col items-center gap-2 md:flex-row">
                                            {field.field.value.length !== 0 && (
                                                <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black p-1 md:w-1/2">
                                                    <h2 className="text-lg">
                                                        {t("form.languages")}
                                                    </h2>
                                                    {field.field.value.map(
                                                        (value, index) => (
                                                            <p
                                                                key={index}
                                                                className=" w-full rounded-xl border-2 border-[#25BA9E] px-2 text-center text-xl text-[#25BA9E]"
                                                            >
                                                                {value}
                                                            </p>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                            <Select>
                                                <SelectTrigger className="h-full w-full rounded-xl border-2 border-black text-xl">
                                                    <SelectValue
                                                        placeholder={t(
                                                            "form.languages",
                                                        )}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            {t(
                                                                "form.languages",
                                                            )}
                                                        </SelectLabel>

                                                        <FormItem className="w-full">
                                                            {languageOptions.map(
                                                                (
                                                                    language,
                                                                    index,
                                                                ) => (
                                                                    <FormField
                                                                        key={
                                                                            index
                                                                        }
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="languages"
                                                                        render={({
                                                                            field,
                                                                        }) => {
                                                                            return (
                                                                                <FormItem
                                                                                    key={
                                                                                        language.language
                                                                                    }
                                                                                    className="flex items-center gap-3"
                                                                                >
                                                                                    <FormControl>
                                                                                        <Checkbox
                                                                                            checked={field.value?.includes(
                                                                                                language.language,
                                                                                            )}
                                                                                            onCheckedChange={(
                                                                                                checked,
                                                                                            ) => {
                                                                                                return checked
                                                                                                    ? field.onChange(
                                                                                                          [
                                                                                                              ...field.value,
                                                                                                              language.language,
                                                                                                          ],
                                                                                                      )
                                                                                                    : field.onChange(
                                                                                                          field.value?.filter(
                                                                                                              (
                                                                                                                  value,
                                                                                                              ) =>
                                                                                                                  value !==
                                                                                                                  language.language,
                                                                                                          ),
                                                                                                      );
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormLabel className="flex items-center justify-center gap-2">
                                                                                        {
                                                                                            language.icon
                                                                                        }
                                                                                        <p>
                                                                                            {
                                                                                                language.language
                                                                                            }
                                                                                        </p>
                                                                                    </FormLabel>
                                                                                </FormItem>
                                                                            );
                                                                        }}
                                                                    />
                                                                ),
                                                            )}
                                                        </FormItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                                <FormMessage />
                                            </Select>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="flex justify-center border-t-2 border-black py-2">
                                <Button
                                    type="button"
                                    className="rounded-full bg-[#25BA9E] text-xl"
                                    onClick={() => {
                                        setTab("education");
                                    }}
                                >
                                    {t("form.button.next")}
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="education" className="space-y-4">
                            <div className="mt-10 flex h-full w-full flex-col items-center rounded-2xl border-2 border-black">
                                <Button
                                    type="button"
                                    className="size-10 -translate-y-1/2 rounded-full border-[#25BA9E] text-2xl text-[#25BA9E]"
                                    variant="outline"
                                    onClick={() => {
                                        appendEducation({
                                            education: "",
                                        });
                                    }}
                                >
                                    +
                                </Button>
                                {educationFields.map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex w-full flex-col items-center"
                                    >
                                        <FormField
                                            control={form.control}
                                            key={`educations.${index}.education`}
                                            name={`educations.${index}.education`}
                                            render={({ field }) => (
                                                <FormItem className="w-full border-b-2 border-black p-2 pb-6">
                                                    <FormLabel>
                                                        {t(
                                                            "form.educations.label",
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t(
                                                                "form.educations.placeholder",
                                                            )}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="button"
                                            className="size-10 -translate-y-1/2 rounded-full border-[#25BA9E] text-2xl text-[#25BA9E]"
                                            variant="outline"
                                            onClick={() => {
                                                removeEducation(index);
                                            }}
                                        >
                                            -
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2 rounded-3xl border-2 border-black p-4">
                                <h2 className="text-xl">{t("form.diploma")}</h2>
                                <hr className="w-full border-2 border-black" />
                                <div className="relative h-fit">
                                    {submitDiploma ? (
                                        <embed
                                            src={submitDiploma}
                                            className="absolute left-1/2 top-0 -z-10  h-[150px] -translate-x-1/2 "
                                        />
                                    ) : (
                                        <div className="absolute left-0 top-0 -z-10 flex h-[150px] w-full flex-col items-center justify-center">
                                            <img
                                                src="/auth/upload.png"
                                                className="h-20"
                                            />
                                            <p>
                                                {t("form.dragDrop.text")}{" "}
                                                <span className="text-[#25BA9E]">
                                                    {t(
                                                        "form.dragDrop.description",
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                    <FormField
                                        control={form.control}
                                        name="diploma"
                                        render={({ field }) => (
                                            <FormItem className="h-fit w-full">
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        {...diplomaRef}
                                                        className="h-[150px] rounded-2xl border-2 border-dashed border-black bg-transparent text-transparent file:text-transparent"
                                                        onChangeCapture={async (
                                                            event,
                                                        ) => {
                                                            const res =
                                                                await getImageData(
                                                                    event as ChangeEvent<HTMLInputElement>,
                                                                );

                                                            setSubmitDiploma(
                                                                res,
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between border-t-2 border-black py-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="rounded-full border-2 border-[#25BA9E] text-xl text-[#25BA9E]"
                                    onClick={() => {
                                        setTab("info");
                                    }}
                                >
                                    {t("form.button.previous")}
                                </Button>
                                <Button
                                    type="button"
                                    className="rounded-full bg-[#25BA9E] text-xl"
                                    onClick={() => {
                                        setTab("experience");
                                    }}
                                >
                                    {t("form.button.next")}
                                </Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="experience" className="space-y-4">
                            <div className="mt-10 flex h-full w-full flex-col items-center rounded-2xl border-2 border-black">
                                <Button
                                    type="button"
                                    className="size-10 -translate-y-1/2 rounded-full border-[#25BA9E] text-2xl text-[#25BA9E]"
                                    variant="outline"
                                    onClick={() => {
                                        appendExperience({
                                            experience: "",
                                        });
                                    }}
                                >
                                    +
                                </Button>
                                {experienceFields.map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex w-full flex-col items-center"
                                    >
                                        <FormField
                                            control={form.control}
                                            key={`experiences.${index}.experience`}
                                            name={`experiences.${index}.experience`}
                                            render={({ field }) => (
                                                <FormItem className="w-full border-b-2 border-black p-2 pb-6">
                                                    <FormLabel>
                                                        {t(
                                                            "form.experiences.label",
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder={t(
                                                                "form.experiences.placeholder",
                                                            )}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="button"
                                            className="size-10 -translate-y-1/2 rounded-full border-[#25BA9E] text-2xl text-[#25BA9E]"
                                            variant="outline"
                                            onClick={() => {
                                                removeExperience(index);
                                            }}
                                        >
                                            -
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex w-full items-center gap-2">
                                <FormField
                                    control={form.control}
                                    name="specializations"
                                    render={(field) => (
                                        <div className="flex h-full w-full flex-col items-center gap-2 md:flex-row">
                                            {field.field.value.length !== 0 && (
                                                <div className="flex w-full flex-wrap items-center gap-2 rounded-xl border-2 border-dashed border-black p-1 md:w-1/2">
                                                    <h2 className="text-lg">
                                                        {t(
                                                            "form.specializations.label",
                                                        )}
                                                    </h2>
                                                    {field.field.value.map(
                                                        (value, index) => (
                                                            <p
                                                                key={index}
                                                                className=" w-full rounded-xl border-2 border-[#25BA9E] px-2 text-center text-xl text-[#25BA9E]"
                                                            >
                                                                {value}
                                                            </p>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                            <Select>
                                                <SelectTrigger className="h-full w-full rounded-xl border-2 border-black text-xl">
                                                    <SelectValue
                                                        placeholder={t(
                                                            "form.specializations.placeholder",
                                                        )}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            {t(
                                                                "form.specializations.label",
                                                            )}
                                                        </SelectLabel>

                                                        <FormItem className="w-full">
                                                            {specializationOptions.map(
                                                                (
                                                                    specialization,
                                                                    index,
                                                                ) => (
                                                                    <FormField
                                                                        key={
                                                                            index
                                                                        }
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name="specializations"
                                                                        render={({
                                                                            field,
                                                                        }) => {
                                                                            return (
                                                                                <FormItem
                                                                                    key={
                                                                                        specialization.specialization
                                                                                    }
                                                                                    className="flex items-center gap-3"
                                                                                >
                                                                                    <FormControl className="">
                                                                                        <Checkbox
                                                                                            checked={field.value?.includes(
                                                                                                specialization.specialization,
                                                                                            )}
                                                                                            onCheckedChange={(
                                                                                                checked,
                                                                                            ) => {
                                                                                                return checked
                                                                                                    ? field.onChange(
                                                                                                          [
                                                                                                              ...field.value,
                                                                                                              specialization.specialization,
                                                                                                          ],
                                                                                                      )
                                                                                                    : field.onChange(
                                                                                                          field.value?.filter(
                                                                                                              (
                                                                                                                  value,
                                                                                                              ) =>
                                                                                                                  value !==
                                                                                                                  specialization.specialization,
                                                                                                          ),
                                                                                                      );
                                                                                            }}
                                                                                        />
                                                                                    </FormControl>
                                                                                    <FormLabel className="flex items-center justify-center gap-2">
                                                                                        <p className="text-xl">
                                                                                            {
                                                                                                specialization.specialization
                                                                                            }
                                                                                        </p>
                                                                                    </FormLabel>
                                                                                </FormItem>
                                                                            );
                                                                        }}
                                                                    />
                                                                ),
                                                            )}
                                                        </FormItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                                <FormMessage />
                                            </Select>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="flex w-full items-center gap-2">
                                <Select>
                                    <SelectTrigger className="w-full rounded-xl border-2 border-black text-xl">
                                        <SelectValue
                                            placeholder={t("form.cost.dates")}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                {t("form.cost.dates")}
                                            </SelectLabel>
                                            <FormField
                                                control={form.control}
                                                name="cost.dates"
                                                render={() => (
                                                    <FormItem>
                                                        {dateOptions.map(
                                                            (item) => (
                                                                <FormField
                                                                    key={
                                                                        item.id
                                                                    }
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name="cost.dates"
                                                                    render={({
                                                                        field,
                                                                    }) => {
                                                                        return (
                                                                            <FormItem
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                                className="flex flex-row items-start space-x-3 space-y-0"
                                                                            >
                                                                                <FormControl>
                                                                                    <Checkbox
                                                                                        checked={field.value?.includes(
                                                                                            item.id,
                                                                                        )}
                                                                                        onCheckedChange={(
                                                                                            checked,
                                                                                        ) => {
                                                                                            return checked
                                                                                                ? field.onChange(
                                                                                                      [
                                                                                                          ...field.value,
                                                                                                          item.id,
                                                                                                      ],
                                                                                                  )
                                                                                                : field.onChange(
                                                                                                      field.value?.filter(
                                                                                                          (
                                                                                                              value,
                                                                                                          ) =>
                                                                                                              value !==
                                                                                                              item.id,
                                                                                                      ),
                                                                                                  );
                                                                                        }}
                                                                                    />
                                                                                </FormControl>
                                                                                <FormLabel className="font-normal">
                                                                                    {
                                                                                        item.label
                                                                                    }
                                                                                </FormLabel>
                                                                            </FormItem>
                                                                        );
                                                                    }}
                                                                />
                                                            ),
                                                        )}
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormField
                                    control={form.control}
                                    name="cost.price"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full rounded-xl border-2 border-black text-xl">
                                                        <SelectValue
                                                            placeholder={t(
                                                                "form.cost.price",
                                                            )}
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            {t(
                                                                "form.cost.price",
                                                            )}
                                                        </SelectLabel>
                                                        {Array.from({
                                                            length: 100,
                                                        }).map((_, index) => (
                                                            <SelectItem
                                                                key={index}
                                                                value={`${index * 10}`}
                                                            >
                                                                {index * 10}lv
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-2 rounded-3xl border-2 border-black p-4">
                                <h2 className="text-xl">{t("form.letter")}</h2>
                                <hr className="w-full border-2 border-black" />
                                <div className="relative h-fit">
                                    {submitLetter ? (
                                        <embed
                                            src={submitLetter}
                                            className="absolute left-1/2 top-0 -z-10  h-[150px] -translate-x-1/2 "
                                        />
                                    ) : (
                                        <div className="absolute left-0 top-0 -z-10 flex h-[150px] w-full flex-col items-center justify-center">
                                            <img
                                                src="/auth/upload.png"
                                                className="h-20"
                                            />
                                            <p>
                                                {t("form.dragDrop.text")}{" "}
                                                <span className="text-[#25BA9E]">
                                                    {t(
                                                        "form.dragDrop.description",
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    )}
                                    <FormField
                                        control={form.control}
                                        name="letter"
                                        render={({ field }) => (
                                            <FormItem className="h-fit w-full">
                                                <FormControl>
                                                    <Input
                                                        accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                        type="file"
                                                        {...letterRef}
                                                        className="h-[150px] rounded-2xl border-2 border-dashed border-black bg-transparent text-transparent file:text-transparent"
                                                        onChangeCapture={async (
                                                            event,
                                                        ) => {
                                                            const res =
                                                                await getImageData(
                                                                    event as ChangeEvent<HTMLInputElement>,
                                                                );

                                                            setSubmitLetter(
                                                                res,
                                                            );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between border-t-2 border-black py-2">
                                <Button
                                    variant="outline"
                                    type="submit"
                                    className="rounded-full border-2 border-[#25BA9E] text-xl  text-[#25BA9E]"
                                    onClick={() => {
                                        setTab("education");
                                    }}
                                >
                                    {t("form.button.previous")}
                                </Button>
                                <Button
                                    variant="outline"
                                    type="submit"
                                    className="rounded-full bg-[#25BA9E] text-xl text-white"
                                >
                                    {t("form.button.submit")}
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </form>
            </Form>
            {/* <Dialog open={isPaying}>
                <DialogContent className="z-[100] max-h-screen w-fit overflow-y-auto">
                    <Tabs className="w-fit space-y-4 text-[#09243E]">
                        <p className="italic text-xl font-semibold ml-3">
                        Subscription plan
                        </p>
                        <TabsList
                            className="flex w-full items-center justify-center p-1"
                            defaultValue="monthly"
                        >
                            <TabsTrigger
                                value="monthly"
                                className="rounded-full  data-[state=active]:bg-[#25BA9E] data-[state=active]:text-white"
                            >
                                Monthly
                            </TabsTrigger>
                            <TabsTrigger
                                value="yearly"
                                className="rounded-full  data-[state=active]:bg-[#25BA9E] data-[state=active]:text-white"
                            >
                                Yearly
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="monthly"
                            className="flex w-fit flex-col items-center gap-8"
                        >
                            <h4 className="italic">
                                First month is{" "}
                                <span className="text-[#25BA9E]">
                                    free of charges
                                </span>
                            </h4>
                            <div className="flex w-fit items-center justify-center gap-4">
                                <SubscriptionOption variant="Basic"  type="Monthly"/>
                                <SubscriptionOption variant="Premium" type="Monthly"/>
                                <SubscriptionOption variant="Deluxe" type="Monthly"/>
                            </div>
                            <div className="flex w-full flex-col items-center gap-2">
                                <h3 className="text-4xl font-bold">Features</h3>
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-2/3"
                                >
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            Is it accessible?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It adheres to the WAI-ARIA
                                            design pattern.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>
                                            Is it accessible?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It adheres to the WAI-ARIA
                                            design pattern.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>
                                            Is it accessible?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It adheres to the WAI-ARIA
                                            design pattern.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>
                                            Is it accessible?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It adheres to the WAI-ARIA
                                            design pattern.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <p className="rounded-full bg-[#FFDBD1] px-2 py-1 italic text-[#FF5B2E]">
                                You are free to cancel your subscrition at any
                                time
                            </p>
                            <div className="flex w-full justify-between border-t-2 py-2 border-black/70">
                                <Button variant="outline" className="text-[#25BA9E] border-[#25BA9E] bg-white rounded-full text-xl py-1" onClick={()=>{setIsPaying(false)}}>Back</Button>
                                <Button className="bg-[#25BA9E] text-xl  rounded-full py-1 text-white" onClick={()=>{submitData("montly")}}>Send</Button>
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="yearly"
                            className="flex w-fit flex-col items-center gap-8"
                        >
                            <h4 className="italic">
                                First month is{" "}
                                <span className="text-[#25BA9E]">
                                    free of charges
                                </span>
                            </h4>
                            <div className="flex w-fit items-center justify-center gap-4">
                                <SubscriptionOption variant="Basic"  type="Yearly"/>
                                <SubscriptionOption variant="Premium" type="Yearly"/>
                                <SubscriptionOption variant="Deluxe" type="Yearly"/>
                            </div>
                            <div className="flex w-full flex-col items-center gap-2">
                                <h3 className="text-4xl font-bold">Features</h3>
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-2/3"
                                >
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>
                                            Is it accessible?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It adheres to the WAI-ARIA
                                            design pattern.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>
                                            Is it accessible?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It adheres to the WAI-ARIA
                                            design pattern.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>
                                            Is it accessible?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It adheres to the WAI-ARIA
                                            design pattern.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>
                                            Is it accessible?
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            Yes. It adheres to the WAI-ARIA
                                            design pattern.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <p className="rounded-full bg-[#FFDBD1] px-2 py-1 italic text-[#FF5B2E]">
                                You are free to cancel your subscrition at any
                                time
                            </p>
                            <div className="flex w-full justify-between border-t-2 py-2 border-black/70">
                                <Button variant="outline" className="text-[#25BA9E] border-[#25BA9E] bg-white rounded-full text-xl py-1" onClick={()=>{setIsPaying(false)}}>Back</Button>
                                <Button className="bg-[#25BA9E] text-xl  rounded-full py-1 text-white" onClick={()=>{submitData("yearly")}}>Send</Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog> */}
        </>
    );
}
