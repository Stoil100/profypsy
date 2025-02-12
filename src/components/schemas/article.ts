import { z } from "zod";

export const ArticlesSchema = (t: (arg: string) => string) =>
    z.object({
        heroImage: z.string().url(t("errors.heroImage.url")).optional(),
        title: z.string().min(1, t("errors.title.required")),
        titleDescriptions: z
            .array(
                z.object({
                    id: z.number(),
                    value: z
                        .string()
                        .min(1, t("errors.titleDescriptions.value.required")),
                }),
            )
            .optional(),
        descriptions: z
            .array(
                z.object({
                    id: z.number(),
                    value: z
                        .string()
                        .min(1, t("errors.descriptions.value.required")),
                }),
            )
            .optional(),
        lists: z
            .array(
                z.object({
                    title: z.string().optional(),
                    items: z
                        .array(
                            z.object({
                                id: z.number(),
                                value: z
                                    .string()
                                    .min(
                                        1,
                                        t("errors.lists.items.value.required"),
                                    ),
                            }),
                        )
                        .min(1, t("errors.lists.items.min")),
                }),
            )
            .optional(),
        docs: z
            .array(
                z.object({
                    title: z.string().min(1, t("errors.docs.title.required")),
                    images: z
                        .array(
                            z.object({
                                id: z.number(),
                                value: z
                                    .string()
                                    .url(t("errors.docs.images.value.url")),
                            }),
                        )
                        .optional(),
                    texts: z
                        .array(
                            z.union([
                                z.object({
                                    id: z.number(),
                                    value: z
                                        .string()
                                        .min(
                                            1,
                                            t(
                                                "errors.docs.texts.value.required",
                                            ),
                                        ),
                                }),
                                z.object({
                                    title: z.string().optional(),
                                    listItems: z
                                        .array(
                                            z.object({
                                                id: z.number(),
                                                value: z
                                                    .string()
                                                    .min(
                                                        1,
                                                        t(
                                                            "errors.docs.texts.listItems.value.required",
                                                        ),
                                                    ),
                                            }),
                                        )
                                        .min(
                                            1,
                                            t(
                                                "errors.docs.texts.listItems.min",
                                            ),
                                        ),
                                }),
                            ]),
                        )
                        .optional(),
                }),
            )
            .optional(),
        footer: z.string().optional(),
        type: z.enum(["standard", "notable", "important"]),
    });
