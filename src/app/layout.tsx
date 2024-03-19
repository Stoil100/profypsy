import type { Metadata } from "next";
import "./globals.css";
import { AuthContextProvider } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

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
                <AuthContextProvider>{children}</AuthContextProvider>
                <Toaster/>
            </body>
        </html>
    );
}
