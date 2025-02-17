import { ApplicationFormT } from "@/components/schemas/application";
import { Button } from "@/components/ui/button";
import {
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
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/firebase/utils/upload";
import { PsychologistT } from "@/models/psychologist";
import { UserRound } from "lucide-react";
import Image from "next/image";
import type { ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

type InfoTabProps = {
    form: UseFormReturn<ApplicationFormT>;
    setTab: (tab: string) => void;
    t: (key: string) => string;
    profile?: PsychologistT;
};

export function InfoTab({ form, setTab, t, profile }: InfoTabProps) {
    async function getImageData(event: ChangeEvent<HTMLInputElement>) {
        return await uploadImage(
            event.target.files![0],
            event.target.files![0].name,
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative flex flex-col items-center justify-center text-center">
                {form.watch("image") ? (
                    <img
                        src={form.watch("image") || "/placeholder.svg"}
                        width={150}
                        height={150}
                        className="absolute -z-10 rounded-full text-transparent"
                        alt={t("imageAlt")}
                    />
                ) : (
                    <UserRound className="absolute -z-10" size={50} />
                )}
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="size-[150px] rounded-full border-2 border-dashed border-black bg-transparent text-transparent file:text-transparent"
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
            </div>

            <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>{t("userName.label")}</FormLabel>
                        <FormControl>
                            <Input
                                placeholder={t("userName.placeholder")}
                                {...field}
                                className="border-2 border-black"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex w-full items-end justify-center gap-2">
                <div className="w-full">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t("telephone.label")}</FormLabel>
                                <div className="flex items-center justify-center rounded-md border-2 border-black px-2">
                                    <Image
                                        src="/logic/bg.png"
                                        width={32}
                                        height={32}
                                        alt="Flag"
                                    />
                                    <FormControl>
                                        <Input
                                            placeholder={t(
                                                "telephone.placeholder",
                                            )}
                                            {...field}
                                            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>{t("age.label")}</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={`${field.value}`}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full  border-2 border-black text-xl">
                                        <SelectValue
                                            placeholder={t("age.placeholder")}
                                            defaultValue={field.value}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            {t("age.placeholder")}
                                        </SelectLabel>
                                        {Array.from({ length: 100 }).map(
                                            (_, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={`${index + 18}`}
                                                >
                                                    {index + 18}
                                                </SelectItem>
                                            ),
                                        )}
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
                        <FormLabel>{t("location.label")}</FormLabel>
                        <FormControl>
                            <Input
                                placeholder={t("location.placeholder")}
                                {...field}
                                className=" border-2 border-black"
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
                        <FormLabel>{t("about.label")}</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder={t("about.placeholder")}
                                {...field}
                                className=" border-2 border-black"
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
                        <FormLabel>{t("quote.label")}</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder={t("quote.placeholder")}
                                {...field}
                                className=" border-2 border-black"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            {!profile && (
                <div className="space-y-2 rounded-xl border-2 border-black p-4">
                    <h2 className="text-xl">{t("documents.cv")}</h2>
                    <hr className="w-full border-2 border-black" />
                    <div className="relative h-fit">
                        {form.watch("cv") ? (
                            <embed
                                src={form.watch("cv")}
                                className="absolute left-1/2 top-0 -z-10 h-[150px] -translate-x-1/2"
                            />
                        ) : (
                            <div className="absolute left-0 top-0 -z-10 flex h-[150px] w-full flex-col items-center justify-center px-1 text-center">
                                <Image
                                    src="/auth/upload.png"
                                    width={80}
                                    height={80}
                                    alt="Upload"
                                />
                                <p>
                                    {t("dragDrop.text")}{" "}
                                    <span className="text-[#25BA9E]">
                                        {t("dragDrop.description")}
                                    </span>
                                </p>
                            </div>
                        )}
                        <FormField
                            control={form.control}
                            name="cv"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="h-[150px] border-2 border-dashed border-black bg-transparent text-transparent file:text-transparent"
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
                    </div>
                </div>
            )}
            <FormField
                control={form.control}
                name="languages"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>{t("languages.label")}</FormLabel>
                        <Select
                            onValueChange={(value) => {
                                if (!field.value.includes(value)) {
                                    field.onChange([...field.value, value]);
                                }
                            }}
                            value={undefined}
                        >
                            <FormControl>
                                <SelectTrigger className="w-full border-2 border-black text-xl">
                                    <SelectValue
                                        placeholder={t("languages.placeholder")}
                                    />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        {t("languages.select")}
                                    </SelectLabel>
                                    <SelectItem
                                        value="bg"
                                        disabled={field.value.includes("bg")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src="/logic/bg.png"
                                                width={24}
                                                height={24}
                                                alt="Bulgarian flag"
                                            />
                                            <span>{t("languages.bg")}</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem
                                        value="en"
                                        disabled={field.value.includes("en")}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Image
                                                src="/logic/en.png"
                                                width={24}
                                                height={24}
                                                alt="English flag"
                                            />
                                            <span>{t("languages.en")}</span>
                                        </div>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {field.value.map((lang, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 rounded-full bg-[#25BA9E] px-3 py-1 text-white"
                                >
                                    <Image
                                        src={`/logic/${lang === "bg" ? "bg" : "en"}.png`}
                                        width={16}
                                        height={16}
                                        alt={`${lang} flag`}
                                    />
                                    <span>{t(`languages.${lang}`)}</span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            field.onChange(
                                                field.value.filter(
                                                    (_, i) => i !== index,
                                                ),
                                            )
                                        }
                                        className="text-white hover:text-black"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex justify-center border-t-2 border-black py-2">
                <Button
                    type="button"
                    className="w-full rounded-md bg-[#25BA9E] text-xl"
                    onClick={() => setTab("education")}
                >
                    {t("buttons.next")}
                </Button>
            </div>
        </div>
    );
}
