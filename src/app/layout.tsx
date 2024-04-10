import type { Metadata } from "next";
import "./globals.css";
import { AuthContextProvider } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
    title: "Profypsy",
    description: "Your own comfort place",
    // icons: [{ rel: 'icon', url: Favicon.src }],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="font-openSans">
                <AuthContextProvider>
                    <Navigation />
                    <main className="pt-[calc(40px+1rem)]">{children}</main>
                </AuthContextProvider>
                <Toaster />
            </body>
        </html>
    );
}
