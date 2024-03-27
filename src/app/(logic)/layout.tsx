"use client"

import { Guidance } from "@/components/Guidance";
import Menu from "@/components/Menu";
import Navigation from "@/components/Navigation";
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
        <section className="bg-[#F7F4E0] md:pb-2 md:pt-20 lg:pb-0 lg:pt-0">
            <Navigation />
            {children}
        </section>
    );
}