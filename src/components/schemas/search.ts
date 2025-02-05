import { z } from "zod";

export const SearchSchema = (t: (arg: string) => string) =>
    z.object({
        support: z.enum(["you", "couples", "families"]),
        languages: z.array(z.enum(["en", "bg"])),
        concern: z.enum(["little", "moderate", "much"]),
    });

export type SearchSchemaType = z.infer<ReturnType<typeof SearchSchema>>;
