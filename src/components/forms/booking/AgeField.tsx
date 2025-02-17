import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";

type AgeFieldProps = {
    form: UseFormReturn<any>;
    t: (key: string) => string;
};

export const AgeField: React.FC<AgeFieldProps> = ({ form, t }) => (
    <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
            <FormItem className="w-full">
                <Select
                    onValueChange={field.onChange}
                    defaultValue={`${field.value}`}
                >
                    <FormControl>
                        <SelectTrigger className="w-full border-2 border-[#52B788] text-xl">
                            <SelectValue
                                placeholder={t("placeholder")}
                                defaultValue={field.value}
                            />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{t("label")}</SelectLabel>
                            {Array.from({ length: 100 }).map((_, index) => (
                                <SelectItem key={index} value={`${index + 14}`}>
                                    {index + 14}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
    />
);
