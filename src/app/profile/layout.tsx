import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <Navigation />
            {children}
            <Footer />
        </section>
    );
}
