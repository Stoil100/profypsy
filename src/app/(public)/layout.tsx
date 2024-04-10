import { Guidance } from "@/components/Guidance";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
            <Guidance variant="footer"/>
        </section>
    );
}
