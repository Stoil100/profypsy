"use client";

import { HomeIcon, LogIn, LogInIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Menu from "./Menu";
import { useAuth } from "./Providers";
import LanguageButton from "./LanguageButton";
import clsx from "clsx";

export default function Navigation() {
    const { user } = useAuth();
    return (
        <header className="fixed top-0 z-[100] flex w-full items-center justify-between bg-[#40916C] p-3  text-white">
            <div className="flex flex-1 items-center gap-4">
                <Link
                    href={user.uid ? "/search" : "/login"}
                    className={clsx(
                        "h-fit rounded-full bg-transparent px-2 py-1 font-openSans ",
                    )}
                >
                    {user.uid ? (
                        <SearchIcon />
                    ) : (
                        <div className="flex gap-2 transition-transform hover:scale-110">
                            {" "}
                            <p className="hidden sm:block">Log in</p>
                            <LogInIcon />
                        </div>
                    )}
                </Link>
            </div>
            <Link
                href={"/"}
                className="flex-1 text-center font-playfairDSC text-3xl font-thin uppercase drop-shadow-md sm:text-4xl"
            >
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
