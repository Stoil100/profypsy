"use client"

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Menu from "./Menu";
import { useAuth } from "./Providers";
import LanguageButton from "./LanguageButton";

export default function Navigation() {
    const {user}=useAuth();
    const router=useRouter();
    return (
        <header className="fixed top-0 z-[100] flex w-full items-center justify-between bg-[#40916C] p-3  text-white">
            <div className="flex flex-1 items-center gap-4">
                <Link
                    href={user.uid ? "/search" : "/login"}
                    className="h-fit rounded-full bg-transparent px-4 font-openSans"
                >
                    {user.uid ? <HomeIcon /> : "Log in"}
                </Link>
            </div>
            <h1 className="flex-1 text-center font-playfairDSC text-4xl font-thin uppercase drop-shadow-md">
                Profypsy
            </h1>
            {user.uid? <Menu/>:<div className="flex flex-1 justify-end"><LanguageButton/></div>}
            
        </header>
    );
}
