import { z } from "zod";

export const NewsletterSchema = (t: (arg: string) => string) =>
    z.object({
        email: z
            .string()
            .email({ message: t("emailValidation") })
            .min(2, {
                message: "Email must be at least 2 characters.",
            }),
    });
