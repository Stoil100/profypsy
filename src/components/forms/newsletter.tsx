import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import MainButton from "../MainButton";
import { NewsletterSchema } from "../schemas/newsletter";

const NewsletterForm = () => {
    const t = useTranslations("Navigation.newsletter.form");
    const formSchema = NewsletterSchema(t);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full gap-2"
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input
                                    className="text-black"
                                    placeholder={t("emailPlaceholder")}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <MainButton type="submit">{t("submit")}</MainButton>
            </form>
        </Form>
    );
};

export default NewsletterForm;
