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
import { uploadImage } from "@/firebase/utils/upload";
import type { PsychologistT } from "@/models/psychologist";
import Image from "next/image";
import type { ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

type ExperienceTabProps = {
    form: UseFormReturn<ApplicationFormT>;
    selectedSubscription: PsychologistT["variant"];
    setSelectedSubscription: (subscription: PsychologistT["variant"]) => void;
    setTab: (tab: string) => void;
    t: (key: string) => string;
};

export function ExperienceTab({ form, setTab, t }: ExperienceTabProps) {
    const {
        fields: experienceFields,
        append: appendExperience,
        remove: removeExperience,
    } = useFieldArray({
        control: form.control,
        name: "experiences",
    });

    async function getImageData(event: ChangeEvent<HTMLInputElement>) {
        return await uploadImage(
            event.target.files![0],
            event.target.files![0].name,
        );
    }

    const dateOptions = [
        { id: "monday", label: t("dates.monday") },
        { id: "tuesday", label: t("dates.tuesday") },
        { id: "wednesday", label: t("dates.wednesday") },
        { id: "thursday", label: t("dates.thursday") },
        { id: "friday", label: t("dates.friday") },
        { id: "saturday", label: t("dates.saturday") },
        { id: "sunday", label: t("dates.sunday") },
    ] as const;
    type DateOption = (typeof dateOptions)[number]["id"];
    const specializationOptions = [
        { label: t("specializations.you"),value:"you" },
        { label: t("specializations.couples"),value:"couples" },
        { label: t("specializations.families"),value:"family" },
    ];

    return (
        <div className="space-y-4">
            <div className="mt-10 flex h-full w-full flex-col items-center rounded-xl border-2 border-black">
                <Button
                    type="button"
                    className="size-10 -translate-y-1/2 rounded-full border-[#25BA9E] text-2xl text-[#25BA9E]"
                    variant="outline"
                    onClick={() =>
                        appendExperience({ id: Date.now(), value: "" })
                    }
                >
                    +
                </Button>
                {experienceFields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex w-full flex-col items-center"
                    >
                        <FormField
                            control={form.control}
                            name={`experiences.${index}.value`}
                            render={({ field }) => (
                                <FormItem className="w-full border-b-2 border-black p-2 pb-6">
                                    <FormLabel>
                                        {t("experience.label")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t(
                                                "experience.placeholder",
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
                            onClick={() => removeExperience(index)}
                        >
                            -
                        </Button>
                    </div>
                ))}
            </div>

            <FormField
                control={form.control}
                name="specializations"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>{t("specializations.label")}</FormLabel>
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
                                        placeholder={t(
                                            "specializations.placeholder",
                                        )}
                                    />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>
                                        {t("specializations.select")}
                                    </SelectLabel>
                                    {specializationOptions.map(
                                        (option, index) => (
                                            <SelectItem
                                                key={index}
                                                value={option.value}
                                                disabled={field.value.includes(
                                                    option.value,
                                                )}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {field.value.map((specialization, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 rounded-full bg-[#25BA9E] px-3 py-1 text-white"
                                >
                                    <span>{specialization}</span>
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

            <div className="flex w-full items-center gap-2">
                <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>{t("dates.label")}</FormLabel>
                            <Select
                                onValueChange={(value: DateOption) => {
                                    if (!field.value.includes(value)) {
                                        field.onChange([...field.value, value]);
                                    }
                                }}
                                value={undefined}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full border-2 border-black text-xl">
                                        <SelectValue
                                            placeholder={t("dates.placeholder")}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            {t("dates.select")}
                                        </SelectLabel>
                                        {dateOptions.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={item.id}
                                                disabled={field.value.includes(
                                                    item.id,
                                                )}
                                            >
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {field.value.map((date, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 rounded-full bg-[#25BA9E] px-3 py-1 text-white"
                                    >
                                        <span>
                                            {
                                                dateOptions.find(
                                                    (option) =>
                                                        option.id === date,
                                                )?.label
                                            }
                                        </span>
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

                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>{t("price.label")}</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full border-2 border-black text-xl">
                                        <SelectValue
                                            placeholder={t("price.placeholder")}
                                            defaultValue={field.value}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            {t("price.placeholder")}
                                        </SelectLabel>
                                        {Array.from({ length: 100 }).map(
                                            (_, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={`${index * 10}`}
                                                >
                                                    {index * 10}lv
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

            <div className="space-y-2 rounded-xl border-2 border-black p-4">
                <h2 className="text-xl">{t("documents.letter")}</h2>
                <hr className="w-full border-2 border-black" />
                <div className="relative h-fit">
                    {form.watch("letter") ? (
                        <embed
                            src={form.watch("letter")}
                            className="absolute left-1/2 top-0 -z-10 h-[150px] -translate-x-1/2"
                        />
                    ) : (
                        <div className="absolute left-0 top-0 -z-10 flex h-[150px] w-full flex-col items-center justify-center text-center">
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
                        name="letter"
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

            {/* <SubscriptionComponent
        form={form}
        selectedSubscription={selectedSubscription}
        setSelectedSubscription={setSelectedSubscription}
        t={(key) => t(`subscription.${key}`)}
      /> */}

            <div className="flex justify-between gap-2 border-t-2 border-black py-2">
                <Button
                    variant="outline"
                    type="button"
                    className="rounded-md border-2 border-[#25BA9E] text-xl text-[#25BA9E]"
                    onClick={() => setTab("education")}
                >
                    {t("buttons.previous")}
                </Button>
                <Button
                    type="submit"
                    className="w-full rounded-md bg-[#25BA9E] text-xl text-white"
                >
                    {t("buttons.submit")}
                </Button>
            </div>
        </div>
    );
}
