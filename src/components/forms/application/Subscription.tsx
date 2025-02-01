import { ApplicationFormT } from "@/components/schemas/application";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PsychologistT } from "@/models/psychologist";
import { Check } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

type SubscriptionComponentProps = {
    form: UseFormReturn<ApplicationFormT>;
    selectedSubscription: PsychologistT["variant"];
    setSelectedSubscription: (subscription: PsychologistT["variant"]) => void;
    t: (key: string) => string;
};

export function SubscriptionComponent({
    form,
    selectedSubscription,
    setSelectedSubscription,
    t,
}: SubscriptionComponentProps) {
    return (
        <FormField
            control={form.control}
            name="variant"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>{t("label")}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedSubscription(
                                    value as PsychologistT["variant"],
                                );
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                        >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="Basic" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    <Card
                                        className={
                                            selectedSubscription === "Basic"
                                                ? "border-primary"
                                                : ""
                                        }
                                    >
                                        <CardHeader>
                                            <CardTitle>
                                                {t("basic.title")}
                                            </CardTitle>
                                            <CardDescription>
                                                {t("basic.description")}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                <li className="flex items-center">
                                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                                    {t("basic.feature1")}
                                                </li>
                                                <li className="flex items-center">
                                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                                    {t("basic.feature2")}
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                {t("basic.price")}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="Premium" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    <Card
                                        className={
                                            selectedSubscription === "Premium"
                                                ? "border-primary"
                                                : ""
                                        }
                                    >
                                        <CardHeader>
                                            <CardTitle>
                                                {t("premium.title")}
                                            </CardTitle>
                                            <CardDescription>
                                                {t("premium.description")}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                <li className="flex items-center">
                                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                                    {t("premium.feature1")}
                                                </li>
                                                <li className="flex items-center">
                                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                                    {t("premium.feature2")}
                                                </li>
                                                <li className="flex items-center">
                                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                                    {t("premium.feature3")}
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                {t("premium.price")}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="Deluxe" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    <Card
                                        className={
                                            selectedSubscription === "Deluxe"
                                                ? "border-primary"
                                                : ""
                                        }
                                    >
                                        <CardHeader>
                                            <CardTitle>
                                                {t("deluxe.title")}
                                            </CardTitle>
                                            <CardDescription>
                                                {t("deluxe.description")}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-2">
                                                <li className="flex items-center">
                                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                                    {t("deluxe.feature1")}
                                                </li>
                                                <li className="flex items-center">
                                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                                    {t("deluxe.feature2")}
                                                </li>
                                                <li className="flex items-center">
                                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                                    {t("deluxe.feature3")}
                                                </li>
                                                <li className="flex items-center">
                                                    <Check className="mr-2 h-4 w-4 text-primary" />
                                                    {t("deluxe.feature4")}
                                                </li>
                                            </ul>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                {t("deluxe.price")}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
