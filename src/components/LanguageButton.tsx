"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "./navigationSetup";
export default function Language() {
    const t = useTranslations("Common");
    const languages = ["en", "bg"];
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const changeLanguage = (language: string) => {
        router.replace(pathname, { locale: language });
    };

    return (
        <Button
            variant="outline"
            className="w-fit border-2 bg-transparent px-0 py-0 font-openSans"
        >
            {languages.map((code) => (
                <div
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={clsx(
                        "flex w-fit items-center gap-4 bg-transparent px-2 text-lg",
                        code === locale && "hidden",
                    )}
                >
                    <Languages className="hidden sm:block" />
                    <p>{t("languages." + code)}</p>
                </div>
            ))}
        </Button>
    );
}
