import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type React from "react";
import type { UseFormReturn } from "react-hook-form";

type EmailFieldProps = {
    form: UseFormReturn<any>;
    t: (key: string) => string;
};

export const EmailField: React.FC<EmailFieldProps> = ({ form, t }) => (
    <FormField
        control={form.control}
        name="email"
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
