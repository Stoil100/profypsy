import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";

type InfoFieldProps = {
    form: UseFormReturn<any>;
    t: (key: string) => string;
};

export const InfoField: React.FC<InfoFieldProps> = ({ form, t }) => (
    <FormField
        control={form.control}
        name="info"
        render={({ field }) => (
            <FormItem className="w-full">
                <FormLabel>{t("label")}</FormLabel>
                <FormControl>
                    <Textarea
                        placeholder={t("placeholder")}
                        {...field}
                        className="border-2 border-dashed border-[#52B788]"
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);
