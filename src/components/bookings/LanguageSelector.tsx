import type React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { CarouselItem } from "@/components/ui/carousel";
import MainButton from "@/components/MainButton";
import type { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { SearchSchemaType } from "../schemas/search";

interface LanguageSelectorProps {
    form: UseFormReturn<SearchSchemaType>;
    t: (key: string) => string;
    scrollNext: () => void;
}

export function LanguageSelector({
    form,
    t,
    scrollNext,
}: LanguageSelectorProps) {
    const languages = [
        {
            id: "bg",
            label: t("bulgarian"),
            imageSrc: "/logic/bg.png",
        },
        {
            id: "en",
            label: t("english"),
            imageSrc: "/logic/en.png",
        },
    ] as const;
    return (
        <CarouselItem className="w-screen pb-2">
            <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-1">
                <h2 className="text-center font-playfairDSC text-3xl capitalize text-[#205041] md:text-4xl">
                    {t("languagePreference")}
                </h2>
                <FormField
                    control={form.control}
                    name="languages"
                    render={() => (
                        <FormItem className="flex w-full max-w-[500px] flex-col items-center gap-4 px-2">
                            {languages.map((language) => (
                                <FormField
                                    key={language.id}
                                    control={form.control}
                                    name="languages"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={language.id}
                                                className={cn(
                                                    "flex w-full items-center gap-2 rounded-lg bg-[#FCFBF4] p-2 drop-shadow-lg transition-all hover:md:scale-110",
                                                    field.value?.includes(
                                                        language.id,
                                                    ) &&
                                                        "bg-gradient-to-r from-[#23A53D] to-[#6DD864] text-white",
                                                )}
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(
                                                            language.id,
                                                        )}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) => {
                                                            return checked
                                                                ? field.onChange(
                                                                      [
                                                                          ...field.value,
                                                                          language.id,
                                                                      ],
                                                                  )
                                                                : field.onChange(
                                                                      field.value?.filter(
                                                                          (
                                                                              value,
                                                                          ) =>
                                                                              value !==
                                                                              language.id,
                                                                      ),
                                                                  );
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="!-mt-[0.5px] flex h-full w-full  cursor-pointer items-center gap-2 ">
                                                    <img
                                                        src={
                                                            language.imageSrc ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={language.label}
                                                    />
                                                    <p className="text-xl">
                                                        {language.label}
                                                    </p>
                                                </FormLabel>
                                            </FormItem>
                                        );
                                    }}
                                />
                            ))}
                        </FormItem>
                    )}
                />
                <MainButton
                    className="text-xl md:text-3xl"
                    onClick={scrollNext}
                >
                    {t("next")}
                </MainButton>
            </div>
        </CarouselItem>
    );
}
