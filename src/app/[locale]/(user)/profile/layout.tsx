import { Footer } from "@/components/Footer";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <Footer />
        </section>
    );
}
