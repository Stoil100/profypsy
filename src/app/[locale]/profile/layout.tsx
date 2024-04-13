import { Guidance } from "@/components/Guidance";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <Guidance variant="footer" />
        </section>
    );
}
