"use client";

import { useAuth } from "@/components/Providers";
import AuthForm from "@/components/forms/auth";
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
                <main className="flex h-max min-h-screen items-center bg-[#FCFBF4]">
                    <div className="relative flex h-full w-full flex-col items-center justify-center space-y-5 px-10 drop-shadow-lg md:w-1/2 md:p-0">
                        <div className="z-10 w-full md:w-2/3">
                            <AuthForm variant="login" />
                        </div>
                    </div>
                    <div className="relative hidden h-full w-1/2 flex-col items-center justify-center gap-8 md:flex ">
                        <img
                            src="/auth/session.png"
                            className="z-10 ml-10 max-h-[550px] object-cover drop-shadow-lg"
                        />
                        <img
                            className="absolute right-0 h-max min-h-screen object-cover"
                            src="/auth/pattern.png"
                        />
                    </div>
                </main>
            )}
        </>
    );
}
