import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type React from "react"; // Added import for React
import type { UseFormReturn } from "react-hook-form";

type NameFieldProps = {
    form: UseFormReturn<any>;
    t: (key: string) => string;
};

export const NameField: React.FC<NameFieldProps> = ({ form, t }) => (
    <FormField
        control={form.control}
        name="userName"
        render={({ field }) => (
            <FormItem className="w-full">
                <FormLabel>{t("label")}</FormLabel>
                <FormControl>
                    <Input
                        placeholder={t("placeholder")}
                        {...field}
                        className="border-2 border-[#52B788]"
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
);
