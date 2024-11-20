import { z } from "zod";
export const AuthSchema = (variant: string, t: (arg: string) => string) =>
    z
        .object({
            email: z.string().email({ message: t("emailValidation") }),
            password: z
                .string()
                .regex(/.*[A-Z].*/, t("passwordUppercaseError"))
                .regex(/.*[a-z].*/, t("passwordLowercaseError"))
                .regex(/.*\d.*/, t("passwordNumberError"))
                .regex(
                    /.*[`~<>?,./!@#$%^&*()\-_+=\"'|{}[\];:\\].*/,
                    t("passwordSpecialCharacterError"),
                )
                .min(8, t("passwordMinLengthError")),
            ...(variant === "register" && {
                confirmPassword: z.string().min(8, t("passwordMinLengthError")),
            }),
        })
        .superRefine(({ confirmPassword, password }, ctx) => {
            if (confirmPassword !== password && variant === "register") {
                ctx.addIssue({
                    code: "custom",
                    message: t("passwordsMismatchError"),
                });
            }
        });
