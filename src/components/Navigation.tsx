"use client"

import { HomeIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Menu from "./Menu";
import { useAuth } from "./Providers";
import LanguageButton from "./LanguageButton";
import clsx from "clsx";

export default function Navigation() {
    const {user}=useAuth();
    const router=useRouter();
    return (
        <header className="fixed top-0 z-[100] flex w-full items-center justify-between bg-[#40916C] p-3  text-white">
            <div className="flex flex-1 items-center gap-4">
                <Link
                    href={user.uid ? "/search" : "/login"}
                    className={clsx("h-fit rounded-full bg-transparent px-2 py-1 font-openSans ",!user.uid&&"border")}
                >
                    {user.uid ? <SearchIcon /> : "Log in"}
                </Link>
            </div>
            <Link href={"/"} className="flex-1 text-center font-playfairDSC text-4xl font-thin uppercase drop-shadow-md">
                Profypsy
            </Link>
            {user.uid ? (
                <Menu />
            ) : (
                <div className="flex flex-1 justify-end">
                    <LanguageButton />
                </div>
            )}
        </header>
    );
}
