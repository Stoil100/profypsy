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
            router.push(`/profile`);
        }
    }, [user, router]);
    return (
        <>
            {!user.uid && (
                <main className="flex h-max max-h-screen min-h-screen items-center bg-[#FCFBF4]">
                    <div className="relative hidden h-max max-h-screen min-h-screen w-1/2 flex-col items-center justify-center gap-8 overflow-hidden md:flex ">
                        <img
                            src="/auth/session.png"
                            className="z-10 ml-10 max-h-[550px] object-cover drop-shadow-lg"
                        />
                        <img
                            className="absolute left-0 h-max min-h-screen rotate-180 overflow-hidden object-cover"
                            src="/auth/pattern.png"
                        />
                    </div>
                    <div className="relative flex h-full w-full flex-col items-center justify-center space-y-5 px-10 drop-shadow-lg md:w-1/2 md:p-0">
                        <div className="z-10 w-full md:w-2/3">
                            <AuthForm variant="register" />
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}
