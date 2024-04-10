export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="overflow-hidden">
            {children}
        </section>
    );
}
