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
import { uploadImage } from "@/firebase/utils/upload";
import Image from "next/image";
import type { ChangeEvent } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useFieldArray } from "react-hook-form";

type EducationTabProps = {
    form: UseFormReturn<ApplicationFormT>;
    setTab: (tab: string) => void;
    t: (key: string) => string;
};

export function EducationTab({ form, setTab, t }: EducationTabProps) {
    const {
        fields: educationFields,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({
        control: form.control,
        name: "educations",
    });

    async function getImageData(event: ChangeEvent<HTMLInputElement>) {
        return await uploadImage(
            event.target.files![0],
            event.target.files![0].name,
        );
    }
    return (
        <div className="space-y-4">
            <div className="mt-10 flex h-full w-full flex-col items-center rounded-xl border-2 border-black">
                <Button
                    type="button"
                    className="size-10 -translate-y-1/2 rounded-full border-[#25BA9E] text-2xl text-[#25BA9E]"
                    variant="outline"
                    onClick={() =>
                        appendEducation({ id: Date.now(), value: "" })
                    }
                >
                    +
                </Button>
                {educationFields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex w-full flex-col items-center"
                    >
                        <FormField
                            control={form.control}
                            name={`educations.${index}.value`}
                            render={({ field }) => (
                                <FormItem className="w-full border-b-2 border-black p-2 pb-6">
                                    <FormLabel>
                                        {t("education.label")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={t(
                                                "education.placeholder",
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
                            onClick={() => removeEducation(index)}
                        >
                            -
                        </Button>
                    </div>
                ))}
            </div>

            <div className="space-y-2 rounded-xl border-2 border-black p-4">
                <h2 className="text-xl">{t("documents.diploma")}</h2>
                <hr className="w-full border-2 border-black" />
                <div className="relative h-fit">
                    {form.watch("diploma") ? (
                        <embed
                            src={form.watch("diploma")}
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
                        name="diploma"
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

            <div className="flex justify-between gap-2 border-t-2 border-black py-2">
                <Button
                    variant="outline"
                    type="button"
                    className="rounded-md border-2 border-[#25BA9E] text-xl text-[#25BA9E]"
                    onClick={() => setTab("info")}
                >
                    {t("buttons.previous")}
                </Button>
                <Button
                    type="button"
                    className="w-full rounded-md bg-[#25BA9E] text-xl"
                    onClick={() => setTab("experience")}
                >
                    {t("buttons.next")}
                </Button>
            </div>
        </div>
    );
}
