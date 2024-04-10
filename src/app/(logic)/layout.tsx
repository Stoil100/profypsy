export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
        </section>
    );
}

// <section className="bg-[#F7F4E0] md:pb-2 md:pt-20 lg:pb-0 lg:pt-0">