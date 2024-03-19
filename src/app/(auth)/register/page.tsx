"use client";

import { useAuth } from "@/components/Providers";
import AuthForm from "@/components/forms/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Register() {
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (user?.uid) {
            router.push(`/profile/${user.uid}`);
        }
    }, [user, router]);
    return (
        <>
            {!user.uid && (
                <main className="flex h-screen max-h-screen items-center justify-around overflow-y-hidden bg-[#FCFBF4]">
                    <div className="relative flex h-full w-1/2 flex-col items-center justify-center gap-8 ">
                        <img
                            src="/auth/session.png"
                            className=" z-10 mr-10 h-auto max-h-[550px] drop-shadow-lg"
                        />
                        <img
                            className="absolute left-0 w-full rotate-180"
                            src="/auth/pattern.png"
                        />
                    </div>
                    <div className="relative flex h-full w-1/2 flex-col items-center justify-center space-y-5 drop-shadow-lg">
                        <div className="z-10 w-2/3">
                            <AuthForm variant="register" />
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}
