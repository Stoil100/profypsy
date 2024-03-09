import LanguageButton from "@/components/LanguageButton";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <header className="fixed top-0 z-10 flex h-fit w-full items-center justify-between px-5 ">
                <Link href="/">
                    <ChevronLeft />
                </Link>
                <h2 className="font-playfairDSC text-5xl capitalize">
                    Profypsy
                </h2>
                <LanguageButton />
            </header>
            {children}
        </div>
    );
}
