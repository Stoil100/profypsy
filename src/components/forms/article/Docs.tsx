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
import { uploadImage } from "@/firebase/utils/upload";
import { Trash2 } from "lucide-react";
import { ChangeEvent } from "react";
import { Control, useFieldArray, UseFormSetValue } from "react-hook-form";

type DocsProps = {
    control: Control<any>;
    setValue: UseFormSetValue<any>;
    name: string;
    t: (arg: string) => string;
};

export function Docs({ control, name, t, setValue }: DocsProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <div className="flex flex-col items-start gap-4">
            <FormLabel>{t("label")}</FormLabel>
            {fields.map((field, index) => (
                <div
                    key={field.id}
                    className="w-full space-y-4 rounded border p-4"
                >
                    <FormField
                        control={control}
                        name={`${name}.${index}.title`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("docTitle.label")}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={t("docTitle.placeholder")}
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DocImages
                        control={control}
                        setValue={setValue}
                        name={`${name}.${index}.images`}
                        t={(key) => t(`images.${key}`)}
                    />
                    <DocTexts
                        control={control}
                        name={`${name}.${index}.texts`}
                        t={(key) => t(`texts.${key}`)}
                    />

                    <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="destructive"
                    >
                        <p className="max-md:hidden">{t("removeButton")}</p>
                        <Trash2 className="md:hidden" />
                    </Button>
                </div>
            ))}
            <MainButton
                type="button"
                onClick={() => append({ title: "", images: [], texts: [] })}
            >
                {t("addButton")}
            </MainButton>
        </div>
    );
}

function DocImages({
    control,
    setValue,
    name,
    t,
}: {
    control: Control<any>;
    setValue: UseFormSetValue<any>;
    name: string;
    t: (arg: string) => string;
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });
    async function getImageData(event: ChangeEvent<HTMLInputElement>) {
        return await uploadImage(
            event.target.files![0],
            event.target.files![0].name,
        );
    }
    return (
        <div className="flex flex-col items-start gap-4">
            <FormLabel>{t("label")}</FormLabel>
            {fields.map((field, index) => (
                <FormField
                    key={field.id}
                    control={control}
                    name={`${name}.${index}.value`}
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <div className="flex items-center space-x-2">
                                    {/* <Input
                                        {...field}
                                        placeholder={t("placeholder")}
                                    /> */}
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChangeCapture={async (event) => {
                                            const res = await getImageData(
                                                event as ChangeEvent<HTMLInputElement>,
                                            );
                                            setValue(field.name, res);
                                        }}
                                        className="mt-2"
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
                onClick={() => append({ id: Date.now(), value: undefined })}
            >
                {t("addButton")}
            </MainButton>
        </div>
    );
}

function DocTexts({
    control,
    name,
    t,
}: {
    control: Control<any>;
    name: string;
    t: (arg: string) => string;
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <div className="flex flex-col items-start gap-4">
            <FormLabel>{t("label")}</FormLabel>
            {fields.map((field, index) => (
                <FormField
                    key={field.id}
                    control={control}
                    name={`${name}.${index}`}
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <div className="flex gap-2">
                                    {"value" in field.value ? (
                                        <Input
                                            value={field.value.value || ""}
                                            onChange={(e) =>
                                                field.onChange({
                                                    ...field.value,
                                                    value: e.target.value,
                                                })
                                            }
                                            placeholder={t("placeholder")}
                                        />
                                    ) : (
                                        <div className="space-y-2">
                                            <Input
                                                value={field.value.title || ""}
                                                onChange={(e) =>
                                                    field.onChange({
                                                        ...field.value,
                                                        title: e.target.value,
                                                    })
                                                }
                                                placeholder={t(
                                                    "listTitle.placeholder",
                                                )}
                                            />
                                            <DocTextListItems
                                                control={control}
                                                name={`${name}.${index}.listItems`}
                                                t={(key) =>
                                                    t(`listItems.${key}`)
                                                }
                                            />
                                        </div>
                                    )}
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
            <div className="flex flex-wrap gap-2">
                <MainButton
                    type="button"
                    onClick={() => append({ id: Date.now(), value: "" })}
                >
                    {t("addTextButton")}
                </MainButton>
                <MainButton
                    type="button"
                    onClick={() =>
                        append({
                            title: "",
                            listItems: [{ id: Date.now(), value: "" }],
                        })
                    }
                >
                    {t("addListButton")}
                </MainButton>
            </div>
        </div>
    );
}

function DocTextListItems({
    control,
    name,
    t,
}: {
    control: Control<any>;
    name: string;
    t: (arg: string) => string;
}) {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <div className="flex flex-col items-start gap-4">
            {fields.map((field, index) => (
                <FormField
                    key={field.id}
                    control={control}
                    name={`${name}.${index}.value`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex items-center space-x-2">
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
                onClick={() => append({ id: Date.now(), value: "" })}
            >
                {t("addButton")}
            </MainButton>
        </div>
    );
}
