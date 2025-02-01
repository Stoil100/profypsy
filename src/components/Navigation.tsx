"use client";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    ChevronsUpDownIcon,
    LogInIcon,
    LogOutIcon,
    MenuIcon,
    SearchIcon,
    UserRoundIcon,
} from "lucide-react";
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

const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
        href={href}
        className="rounded-md p-2 text-xl transition-all hover:bg-white hover:text-black"
    >
        {label}
    </Link>
);

export default function Navigation() {
    const { user, logOut } = useAuth();
    const t = useTranslations("Navigation");
    const companyName = t("companyName");

    const renderUserMenu = () => (
        <>
            <NavLink href="/articles" label={t("blog")} />
            <Menubar className="border-0 bg-transparent">
                <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer rounded-md p-2 text-xl text-white hover:bg-white hover:text-black">
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
                            <LogOutIcon />
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <LanguageButton />
        </>
    );

    return (
        <header>
            <nav className="fixed top-0 z-[100] flex w-full items-center justify-between bg-[#40916C] p-3 font-playfairDSC text-white">
                {user.uid ? (
                    <>
                        <Link
                            href="/"
                            className="text-center font-playfairDSC text-3xl font-thin uppercase drop-shadow-md sm:text-4xl"
                        >
                            {companyName}
                        </Link>
                        <div className="hidden items-center gap-2 sm:flex">
                            {renderUserMenu()}
                        </div>
                        <Sheet>
                            <SheetTrigger className="block text-inherit sm:hidden">
                                <MenuIcon />
                            </SheetTrigger>
                            <SheetContent
                                side="top"
                                className="z-[110] flex w-full flex-col bg-gradient-to-b from-[#40916C] to-[#52B788] text-white"
                            >
                                <SheetHeader>
                                    <SheetTitle className="font-playfairDSC text-3xl text-white underline decoration-2 sm:text-4xl">
                                        {t("menu")}
                                    </SheetTitle>
                                </SheetHeader>
                                <Link
                                    href="/search"
                                    className="w-fit border-b-2 font-playfairDSC text-xl"
                                >
                                    {t("search")}
                                </Link>
                                <Link
                                    href="/articles"
                                    className="w-fit border-b-2 font-playfairDSC text-xl"
                                >
                                    {t("blog")}
                                </Link>
                                <Collapsible>
                                    <CollapsibleTrigger>
                                        <div className="flex w-full items-center justify-center gap-1 font-playfairDSC text-xl">
                                            <span>{t("about")}</span>
                                            <ChevronsUpDownIcon className="h-4 w-4" />
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="ml-2 mt-2 flex flex-col gap-y-2">
                                        <Link
                                            href="/mission"
                                            className="w-fit border-b-2"
                                        >
                                            {t("ourMission")}
                                        </Link>
                                        <Link
                                            href="/privacy-policy"
                                            className="w-fit border-b-2"
                                        >
                                            {t("privacyPolicy")}
                                        </Link>
                                        <Link href="/terms-of-use">
                                            {t("termsOfUse")}
                                        </Link>
                                    </CollapsibleContent>
                                </Collapsible>
                                <Collapsible>
                                    <CollapsibleTrigger>
                                        <div className="flex w-full items-center justify-center gap-1 font-playfairDSC text-xl">
                                            <span>{t("profile")}</span>
                                            <ChevronsUpDownIcon className="h-4 w-4" />
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="ml-2 mt-2 flex flex-col gap-y-2">
                                        <Link
                                            href="/profile"
                                            className="w-fit border-b-2"
                                        >
                                            {t("myProfile")}
                                        </Link>
                                        {user.admin && (
                                            <Link
                                                href="/admin"
                                                className="w-fit border-b-2"
                                            >
                                                {t("admin")}
                                            </Link>
                                        )}
                                        <div
                                            onClick={logOut}
                                            className="flex cursor-pointer items-center gap-2 font-openSans"
                                        >
                                            {t("logOut")} <LogOutIcon />
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                                <SheetFooter>
                                    <p className="text-center text-sm italic text-white">
                                        {companyName} &copy;{" "}
                                        {new Date().getFullYear()}
                                    </p>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
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
                            {companyName}
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
