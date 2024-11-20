import { z } from "zod";

export const EditSchema = (t: (arg: string) => string) =>
    z.object({
        phone: z
            .string()
            .regex(
                /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
                t("formSchemaErrors.invalidPhoneNumber"),
            ),
        age: z.string().min(1, t("formSchemaErrors.selectAge")),
        about: z
            .string()
            .min(10, t("formSchemaErrors.shortDescription"))
            .max(500, t("formSchemaErrors.longDescription")),
        quote: z
            .string()
            .min(5, t("formSchemaErrors.shortQuote"))
            .max(100, t("formSchemaErrors.longQuote")),
        image: z.any().optional(),
        cv: z
            .any()
            .refine((file) => file?.length == 1, t("formSchemaErrors.validCV")),
        letter: z
            .any()
            .refine(
                (file) => file?.length == 1,
                t("formSchemaErrors.validLetter"),
            ),
        diploma: z
            .any()
            .refine(
                (file) => file?.length == 1,
                t("formSchemaErrors.validDiploma"),
            ),
        cost: z.object({
            dates: z
                .array(z.string())
                .refine((value) => value.some((item) => item), {
                    message: t("formSchemaErrors.selectAtLeastOneDate"),
                }),
            price: z.string().min(1, t("formSchemaErrors.selectPricePerHour")),
        }),
        educations: z.array(
            z.object({
                education: z
                    .string()
                    .min(1, t("formSchemaErrors.validEducation")),
            }),
        ),
        experiences: z.array(
            z.object({
                experience: z
                    .string()
                    .min(1, t("formSchemaErrors.validExperience")),
            }),
        ),
        userName: z.string().min(3, t("formSchemaErrors.validName")),
        location: z
            .string()
            .min(1, t("formSchemaErrors.validCity"))
            .max(60, t("formSchemaErrors.cityCharacterLimit")),
        specializations: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: t("formSchemaErrors.selectAtLeastOneSpecialization"),
            }),
        languages: z
            .array(z.string())
            .refine((value) => value.some((item) => item), {
                message: t("formSchemaErrors.selectAtLeastOneLanguage"),
            }),
    });
