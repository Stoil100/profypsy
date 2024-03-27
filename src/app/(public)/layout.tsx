import { Guidance } from "@/components/Guidance";
import Navigation from "@/components/Navigation";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <Navigation />
            {children}
            <Guidance variant="footer"/>
        </section>
    );
}
