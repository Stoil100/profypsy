import { z } from "zod";
export const ApplicationSchema = (t: (arg: string) => string) =>
    z.object({
        phone: z
            .string()
            .regex(
                /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
                t("invalidPhoneNumber"),
            ),
        age: z.string().min(1, t("selectAge")),
        about: z
            .string()
            .min(10, t("shortDescription"))
            .max(500, t("longDescription")),
        quote: z.string().min(5, t("shortQuote")).max(100, t("longQuote")),
        image: z.string().url().optional(),
        cv: z.string().url(t("validCV")),
        letter: z.string().url(t("validLetter")),
        diploma: z.string().url(t("validDiploma")),
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
                message: t("selectAtLeastOneDate"),
            }),
        price: z.string().min(1, t("selectPricePerHour")),
        educations: z.array(
            z.object({
                id: z.number(),
                value: z.string().min(1, t("validEducation")),
            }),
        ),
        experiences: z.array(
            z.object({
                id: z.number(),
                value: z.string().min(1, t("validExperience")),
            }),
        ),
        userName: z.string().min(3, t("validName")),
        location: z
            .string()
            .min(1, t("validCity"))
            .max(60, t("cityCharacterLimit")),
        specializations: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: t("selectAtLeastOneSpecialization"),
            }),
        languages: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: t("selectAtLeastOneLanguage"),
            }),
        variant: z.enum(["Deluxe", "Premium", "Basic"]),
    });
export type ApplicationFormT = z.infer<ReturnType<typeof ApplicationSchema>>;
