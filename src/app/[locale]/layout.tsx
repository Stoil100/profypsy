import Navigation from "@/components/Navigation";
import { AuthContextProvider } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { NextIntlClientProvider, useMessages } from "next-intl";
import "./globals.css";

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
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <AuthContextProvider>
                        <Navigation />
                        <main className="mt-[--nav-height] bg-[#fbf9f0]">
                            {children}
                        </main>
                    </AuthContextProvider>
                </NextIntlClientProvider>
                <Toaster />
            </body>
        </html>
    );
}
