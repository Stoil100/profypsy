"use client";

import { useAuth } from "@/components/Providers";
import AuthForm from "@/components/schemas/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
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
                <main className="flex h-full items-center justify-center bg-[#FCFBF4]">
                    <div className="relative flex  h-full  min-h-[calc(100vh-(1rem+40px))] w-full flex-col items-center justify-center space-y-5 px-10 drop-shadow-lg md:w-1/2 md:p-0">
                        <div className="z-10 w-full md:w-2/3">
                            <AuthForm variant="login" />
                        </div>
                    </div>
                    <div className="relative hidden h-max max-h-[calc(100vh-(1rem+40px))] min-h-[calc(100vh-(1rem+40px))] w-1/2 flex-col items-center justify-center gap-8 overflow-hidden md:flex ">
                        <img
                            src="/auth/session.png"
                            className="z-10 ml-10 max-h-[550px] object-cover drop-shadow-lg"
                        />
                        <img
                            className="absolute right-0 h-max min-h-screen overflow-hidden object-cover"
                            src="/auth/pattern.png"
                        />
                    </div>
                </main>
            )}
        </>
    );
}
