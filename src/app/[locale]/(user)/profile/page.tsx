"use client";

import ProfileContent from "@/components/profile/Content";
import { useAuth } from "@/components/Providers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user?.uid) {
            router.push("/login");
        }
    }, [user, router]);

    if (!user?.uid) return null;

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#adebb3] max-md:py-8">
            <ProfileContent user={user} />
        </main>
    );
}
