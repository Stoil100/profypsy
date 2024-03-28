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
                <main className="flex h-screen max-h-screen items-center justify-around overflow-y-hidden bg-[#FCFBF4]">
                     <div className="relative md:flex hidden h-full w-1/2 flex-col items-center justify-center gap-8 ">
                        <img
                            src="/auth/session.png"
                            className="z-10 ml-10 object-cover max-h-[550px] drop-shadow-lg"
                        />
                        <img
                            className="absolute object-cover h-full left-0 rotate-180"
                            src="/auth/pattern.png"
                        />
                    </div>
                    <div className="relative flex h-full w-full px-10 md:p-0 md:w-1/2 flex-col items-center justify-center space-y-5 drop-shadow-lg">
                    <div className="z-10 w-full md:w-2/3">
                            <AuthForm variant="register" />
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}
