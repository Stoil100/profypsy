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
            <header className="fixed top-0 z-50 flex h-fit w-full items-center justify-between px-5 backdrop-blur">
                <Link href="/" className="flex-1">
                    <ChevronLeft />
                </Link> 
                <h2 className="flex-1 text-center font-playfairDSC text-5xl capitalize">
                    Profypsy
                </h2>
                <div className="flex flex-1 justify-end">
                    <LanguageButton />
                </div>
            </header>
            {children}
        </div>
    );
}
