"use client"

import Menu from "@/components/Menu";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router=useRouter();
    return (
        <section className="bg-[#F7F4E0]">
            <header className="flex p-2 fixed w-full top-0 text-black z-50">
                <div className="flex-1"><ChevronLeft className="cursor-pointer" onClick={()=>{router.back()}}/></div>
                <Link href={"/"} className="flex-1 flex justify-center text-4xl font-playfairDSC">Profypsy</Link>
               <Menu/>
            </header>
            {children}
        </section>
    );
}