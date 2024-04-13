import type { Metadata } from "next";
import "./globals.css";
import { AuthContextProvider } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";
import { NextIntlClientProvider, useMessages } from "next-intl";

export const metadata: Metadata = {
    title: "Profypsy",
    description: "Your own comfort place",
    // icons: [{ rel: 'icon', url: Favicon.src }],
};

export default function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const messages = useMessages();
    return (
        <html lang={locale}>
            <body className="font-openSans">
                <NextIntlClientProvider messages={messages}>
                    <AuthContextProvider>
                        <Navigation />
                        <main className="pt-[calc(40px+1rem)]">{children}</main>
                    </AuthContextProvider>
                </NextIntlClientProvider>
                <Toaster />
            </body>
        </html>
    );
}
