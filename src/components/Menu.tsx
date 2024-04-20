"use client";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Guidance } from "./Guidance";
import { useTranslations } from "next-intl";

export default function Menu() {
    const t = useTranslations("Navigation");
    return (
        <div className="flex flex-1 items-center justify-end gap-4 text-inherit">
            <Sheet>
                <SheetTrigger className="text-inherit">
                    <MenuIcon />
                </SheetTrigger>
                <SheetContent
                    side="top"
                    className="z-[110] flex w-full flex-col items-center justify-between bg-gradient-to-b from-[#40916C] to-[#52B788] text-white sm:w-auto"
                >
                    <SheetHeader>
                        <SheetTitle className="text-center font-playfairDSC text-3xl text-white underline decoration-2 sm:text-4xl">
                            {t("menu")}
                        </SheetTitle>
                    </SheetHeader>
                    <Guidance variant="navigation" />
                    <SheetFooter>
                        <p className="text-sm italic text-white">
                            {t("companyName")} &copy; {new Date().getFullYear()}
                        </p>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}
