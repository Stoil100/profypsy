import { z } from "zod";

export const BookingSchema = (t: (arg: string) => string) =>
    z.object({
        userName: z.string().min(3, t("validName")),
        info: z.string().min(2, t("infoRequired")).max(500, t("infoLimit")),
        session: z.string().min(1, t("selectOption")),
        phone: z
            .string()
            .min(1, t("phoneRequired"))
            .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, {
                message: t("invalidPhone"),
            }),
        email: z.string().email({ message: t("validEmail") }),
        age: z.string().min(1, t("selectAge")),
    });
