import { z } from "zod";
export const ArticlesSchema = () =>
    z.object({
        title: z.string(),
        titleDesc: z.string().optional(),
        image: z.string().optional(),
        descriptions: z
            .array(
                z.object({
                    descTitle: z.string().optional(),
                    description: z.string().optional(),
                }),
            )
            .optional(),
        tables: z
            .array(
                z.object({
                    tableTitle: z.string().optional(),
                    tableItems: z.array(z.string()).optional(),
                }),
            )
            .optional(),
        footer: z.string().optional(),
    });
