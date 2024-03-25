import Footer from "@/components/Footer";
// import Menu from "@/components/Menu";
import Navigation from "@/components/Navigation";
import { ChevronLeft } from "lucide-react";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="bg-[#F7F4E0]">
            {/* <header className="flex p-2">
                <div className="flex-1"><ChevronLeft/></div>
                <div className="flex-1 flex justify-center text-4xl font-playfairDSC">Profypsy</div>
               <Menu/>
            </header> */}
            {children}
        </section>
    );
}