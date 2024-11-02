"use client";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { LogInIcon, LogOutIcon, SearchIcon, UserRoundIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageButton from "./LanguageButton";
import { useAuth } from "./Providers";

const MenuItemLink = ({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) => (
    <MenubarItem>
        <Link
            href={href}
            className="block w-full rounded py-1 hover:bg-gray-100"
        >
            {children}
        </Link>
    </MenubarItem>
);

export default function Navigation() {
    const { user, logOut } = useAuth();
    const t = useTranslations("Navigation");
    return (
        <header>
            <nav className="fixed top-0 z-[100] flex w-full items-center justify-between bg-[#40916C] p-3 font-playfairDSC text-white">
                {user.uid ? (
                    <>
                        <Link
                            href="/"
                            className="text-center font-playfairDSC text-3xl font-thin uppercase drop-shadow-md sm:text-4xl"
                        >
                            {t("companyName")}
                        </Link>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/articles"
                                className="rounded-md p-2 text-xl transition-all hover:bg-white hover:text-black"
                            >
                                {t("blog")}
                            </Link>

                            <Menubar className="border-0 bg-transparent">
                                <MenubarMenu>
                                    <MenubarTrigger className="cursor-pointer rounded-md p-2  text-xl text-white hover:bg-white hover:text-black ">
                                        {t("about")}
                                    </MenubarTrigger>
                                    <MenubarContent className="mr-2 mt-2 rounded-none">
                                        <MenuItemLink href="/mission">
                                            {t("ourMission")}
                                        </MenuItemLink>
                                        <MenubarSeparator />
                                        <MenuItemLink href="/privacy-policy">
                                            {t("privacyPolicy")}
                                        </MenuItemLink>
                                        <MenubarSeparator />
                                        <MenuItemLink href="/terms-of-use">
                                            {t("termsOfUse")}
                                        </MenuItemLink>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>

                            <Link
                                href="/search"
                                className="rounded-full p-2 transition-all hover:bg-white hover:text-black"
                            >
                                <SearchIcon />
                            </Link>

                            <Menubar className="border-0 bg-transparent">
                                <MenubarMenu>
                                    <MenubarTrigger className="cursor-pointer rounded-full p-2 text-white hover:bg-white hover:text-black">
                                        <UserRoundIcon />
                                    </MenubarTrigger>
                                    <MenubarContent className="mr-2 mt-2 rounded-none">
                                        <MenuItemLink href="/profile">
                                            {t("myProfile")}
                                        </MenuItemLink>
                                        {user.admin && (
                                            <>
                                                <MenubarSeparator />
                                                <MenuItemLink href="/admin">
                                                    {t("admin")}
                                                </MenuItemLink>
                                            </>
                                        )}
                                        <MenubarSeparator />
                                        <MenubarItem
                                            onClick={logOut}
                                            className="flex cursor-pointer items-center justify-between font-openSans"
                                        >
                                            <span className="hidden sm:block">
                                                {t("logOut")}
                                            </span>
                                            <MenubarShortcut>
                                                <LogOutIcon />
                                            </MenubarShortcut>
                                        </MenubarItem>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>

                            <LanguageButton />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-1 items-center gap-4">
                            <Link
                                href="/login"
                                className="rounded-full bg-transparent px-2 py-1 font-openSans transition-transform hover:scale-110"
                            >
                                <div className="flex gap-2">
                                    <span className="hidden sm:block">
                                        {t("logIn")}
                                    </span>
                                    <LogInIcon />
                                </div>
                            </Link>
                        </div>

                        <Link
                            href="/"
                            className="flex-1 text-center font-playfairDSC text-3xl font-thin uppercase drop-shadow-md sm:text-4xl"
                        >
                            {t("companyName")}
                        </Link>

                        <div className="flex flex-1 justify-end">
                            <LanguageButton />
                        </div>
                    </>
                )}
            </nav>
        </header>
    );
}
