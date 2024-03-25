import LanguageButton from "@/components/LanguageButton";
import Navigation from "@/components/Navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
           <Navigation/>
            {children}
        </div>
    );
}
