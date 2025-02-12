import { z } from "zod";
export const ApplicationSchema = (t: (arg: string) => string) =>
    z.object({
        phone: z
            .string()
            .regex(
                /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
                t("phoneNumber"),
            ),
        age: z.string().min(1, t("age")),
        about: z
            .string()
            .min(10, t("description.short"))
            .max(500, t("description.long")),
        quote: z.string().min(5, t("quote.short")).max(100, t("quote.long")),
        image: z.string().url().optional(),
        cv: z.string().url(t("documents.cv")),
        letter: z.string().url(t("documents.letter")),
        diploma: z.string().url(t("documents.diploma")),
        dates: z
            .array(
                z.enum([
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                ]),
            )
            .refine((value) => value.some((item) => item), {
                message: t("selection.atLeastOneDate"),
            }),
        price: z.string().min(1, t("selection.pricePerHour")),
        educations: z.array(
            z.object({
                id: z.number(),
                value: z.string().min(1, t("validity.education")),
            }),
        ),
        experiences: z.array(
            z.object({
                id: z.number(),
                value: z.string().min(1, t("validity.experience")),
            }),
        ),
        userName: z.string().min(3, t("validity.name")),
        location: z
            .string()
            .min(1, t("validity.city"))
            .max(60, t("validity.cityCharacterLimit")),
        specializations: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: t("selection.atLeastOneSpecialization"),
            }),
        languages: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: t("selection.atLeastOneLanguage"),
            }),
        variant: z.enum(["Deluxe", "Premium", "Basic"]),
    });
export type ApplicationFormT = z.infer<ReturnType<typeof ApplicationSchema>>;
