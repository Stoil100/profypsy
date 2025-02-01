import MainButton from "@/components/MainButton";
import { Button } from "@/components/ui/button";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";

type DescriptionsProps = {
    control: Control<any>;
    name: string;
    t: (arg: string) => string;
};

export function Descriptions({ control, name, t }: DescriptionsProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <div className="flex flex-col items-start space-y-4">
            <FormLabel>{t("label")}</FormLabel>
            {fields.map((field, index) => (
                <FormField
                    key={field.id}
                    control={control}
                    name={`${name}.${index}.value`}
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <div className="flex items-center gap-2">
                                    <Input
                                        {...field}
                                        placeholder={t("placeholder")}
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => remove(index)}
                                        variant="destructive"
                                    >
                                        <p className="max-md:hidden">
                                            {t("removeButton")}
                                        </p>
                                        <Trash2 className="md:hidden" />
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ))}
            <MainButton
                type="button"
                onClick={() => append({ id: fields.length, value: "" })}
            >
                {t("addButton")}
            </MainButton>
        </div>
    );
}
