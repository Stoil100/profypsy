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
import type React from "react"; // Import React
import type { UseFormReturn } from "react-hook-form";

type SessionFieldProps = {
    form: UseFormReturn<any>;
    t: (key: string) => string;
};

export const SessionField: React.FC<SessionFieldProps> = ({ form, t }) => (
    <FormField
        control={form.control}
        name="session"
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
                            <SelectItem value="You">
                                {t("options.you")}
                            </SelectItem>
                            <SelectItem value="Couple">
                                {t("options.couples")}
                            </SelectItem>
                            <SelectItem value="Family">
                                {t("options.families")}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}
    />
);
