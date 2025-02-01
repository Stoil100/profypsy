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
        <main className="flex h-max min-h-[calc(100vh-(1rem+40px))] items-center justify-center bg-[#adebb3] py-4 pt-8">
            <ProfileContent user={user} />
        </main>
    );
}
