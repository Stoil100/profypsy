import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type React from "react"; // Added import for React
import type { UseFormReturn } from "react-hook-form";

type PhoneFieldProps = {
    form: UseFormReturn<any>;
    t: (key: string) => string;
};

export const PhoneField: React.FC<PhoneFieldProps> = ({ form, t }) => (
    <div className="w-full">
        <div className="flex items-center justify-center rounded-full border-2 border-[#52B788] px-2">
            <img src="/logic/bg.png" className="h-8" alt="Bulgaria flag" />
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormControl>
                            <Input
                                placeholder={t("placeholder")}
                                {...field}
                                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    </div>
);
