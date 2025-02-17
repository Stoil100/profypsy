import { CarouselItem } from "@/components/ui/carousel";

import MainButton from "@/components/MainButton";
import { FormField, FormItem } from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import type React from "react";
import { SearchSchemaType } from "../schemas/search";

interface SupportOptionProps {
    name: string;
    iconSrc: string;
    isSelected: boolean;
    onSelect: () => void;
}

export const SupportOption: React.FC<SupportOptionProps> = ({
    name,
    iconSrc,
    isSelected,
    onSelect,
}) => (
    <div
        onClick={onSelect}
        className={cn(
            "flex cursor-pointer items-center space-x-2 rounded-lg bg-[#FCFBF4] p-1 drop-shadow-lg transition-all hover:md:scale-110",
            isSelected &&
                "bg-gradient-to-r from-[#23A53D] to-[#6DD864] text-white",
        )}
    >
        <img
            src={iconSrc || "/placeholder.svg"}
            className="size-16 md:size-20"
            alt={name}
        />
        <p className="text-md md:text-xl">{name}</p>
        <ChevronRight />
    </div>
);

interface SupportOptionsProps {
    form: UseFormReturn<SearchSchemaType>;
    t: (key: string) => string;
    scrollNext: () => void;
}

export function SupportSelector({ form, t, scrollNext }: SupportOptionsProps) {
    return (
        <CarouselItem className="w-full">
            <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-1 px-2">
                <h2 className="text-center font-playfairDSC text-3xl capitalize text-[#205041] md:text-4xl">
                    {t("whoIsTheSupportFor")}
                </h2>
                <FormField
                    control={form.control}
                    name="support"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[500px] space-y-4">
                            <SupportOption
                                name={t("forYou")}
                                iconSrc="/search/person.png"
                                isSelected={field.value === "you"}
                                onSelect={() => field.onChange("you")}
                            />
                            <SupportOption
                                name={t("forCouples")}
                                iconSrc="/search/couples.png"
                                isSelected={field.value === "couples"}
                                onSelect={() => field.onChange("couples")}
                            />
                            <SupportOption
                                name={t("forFamilies")}
                                iconSrc="/search/families.png"
                                isSelected={field.value === "families"}
                                onSelect={() => field.onChange("families")}
                            />
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
