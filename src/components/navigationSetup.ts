import { createSharedPathnamesNavigation } from "next-intl/navigation";
// import { languages } from "@/i18n";

export const { redirect, usePathname, useRouter } =
    createSharedPathnamesNavigation({
        locales: ["en", "bg"],
    });
