import { CarouselItem } from "@/components/ui/carousel";
import { Slider } from "@/components/ui/slider";
import MainButton from "@/components/MainButton";
import type { UseFormReturn } from "react-hook-form";
import { FormField, FormItem } from "@/components/ui/form";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchSchemaType } from "../schemas/search";

interface ConcernSelectorProps {
    form: UseFormReturn<SearchSchemaType>;
    t: (key: string) => string;
}

export function ConcernSelector({ form, t }: ConcernSelectorProps) {
    const [draggedValue, setDraggedValue] = useState(0);

    return (
        <CarouselItem className="w-screen pb-2">
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-4">
                <h2 className="text-center font-playfairDSC text-2xl capitalize text-[#205041] md:text-4xl">
                    {t("howMuchDoesItConcernYou")}
                </h2>
                <p className="bg-gradient-to-b from-[#6DD864] to-[#23A53D] bg-clip-text text-transparent">
                    {t("dragFromLeftToRight")}
                </p>
                <FormField
                    control={form.control}
                    name="concern"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[500px] space-y-4">
                            <div className="flex h-[40px] rounded-full border-2 border-white">
                                <div
                                    className="flex w-1/3 cursor-pointer items-center justify-center rounded-l-full bg-[#08BF6B] text-white"
                                    onClick={() => {
                                        setDraggedValue(0);
                                        field.onChange("little");
                                    }}
                                >
                                    {t("aLittle")}
                                </div>
                                <div
                                    className={cn(
                                        "flex w-1/3 cursor-pointer items-center justify-center transition-colors duration-300",
                                        draggedValue >= 50
                                            ? "bg-[#FCD96A] text-white"
                                            : "text-[#FCD96A]",
                                    )}
                                    onClick={() => {
                                        setDraggedValue(50);
                                        field.onChange("moderate");
                                    }}
                                >
                                    {t("moderate")}
                                </div>
                                <div
                                    className={cn(
                                        "flex w-1/3 cursor-pointer items-center justify-center rounded-r-full transition-colors duration-300",
                                        draggedValue >= 100
                                            ? "bg-[#FC8A6A] text-white"
                                            : "text-[#FC8A6A]",
                                    )}
                                    onClick={() => {
                                        setDraggedValue(100);
                                        field.onChange("much");
                                    }}
                                >
                                    {t("quiteMuch")}
                                </div>
                            </div>
                            <Slider
                                onValueChange={(value) => {
                                    setDraggedValue(value[0]);
                                    if (value[0] === 0)
                                        field.onChange("little");
                                    else if (value[0] === 50)
                                        field.onChange("moderate");
                                    else field.onChange("much");
                                }}
                                defaultValue={[0]}
                                max={100}
                                step={50}
                                className="w-full"
                                value={[draggedValue]}
                            />
                        </FormItem>
                    )}
                />
                <MainButton className="text-xl md:text-3xl" type="submit">
                    {t("finishUp")}
                </MainButton>
            </div>
        </CarouselItem>
    );
}
