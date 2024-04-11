"use client";

import {
    Facebook,
    Instagram,
    Languages,
    LogInIcon,
    LogOutIcon,
    Twitter,
} from "lucide-react";
import React from "react";
import GradientButton from "./MainButton";
import { Button } from "./ui/button";
import clsx from "clsx";
import Link from "next/link";
import { useAuth } from "./Providers";
import { UserType } from "@/models/user";
import { NextRouter } from "next/router";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface GuidanceProps {
    variant: "footer" | "navigation";
}
interface AboutProps {
    user: UserType;
    router: AppRouterInstance;
}


export const Guidance: React.FC<GuidanceProps> = ({ variant }) => {
    const { user, logOut } = useAuth();
    const router = useRouter();
    const SocialMediaLinks = () => (
        <div className="flex w-full gap-5 items-center justify-between text-[#F1ECCC]">
            <Link href="https://instagram.com" aria-label="Instagram">
                <Instagram className="size-8 md:size-12" absoluteStrokeWidth />
            </Link>
            <Link href="https://facebook.com" aria-label="Facebook">
                <Facebook className="size-8 md:size-12" absoluteStrokeWidth />
            </Link>
            <Link href="https://twitter.com" aria-label="Twitter">
                <Twitter className="size-8 md:size-12" absoluteStrokeWidth />
            </Link>
        </div>
    );
    
    const ServicesLinks = () => (
        <>
            <Link href="/search" className="transition-transform hover:scale-110 text-inherit">
                For You
            </Link>
            <Link href="/search" className="transition-transform hover:scale-110">
                Couples
            </Link>
            <Link href="/search" className="transition-transform hover:scale-110">
                Families
            </Link>
        </>
    );
    
    const UsefulLinks:React.FC<UserType> = (user) => (
            <>
                <Link
                    href="/search"
                    className="transition-transform hover:scale-110"
                >
                    Find a therapist
                </Link>
                <Link
                    href="/profile"
                    className="transition-transform hover:scale-110"
                >
                    My profile
                </Link>
                <Link
                    href="/articles"
                    className="transition-transform hover:scale-110"
                >
                    Blog
                </Link>
                {user.role==="admin"&& <Link
                    href="/admin"
                    className="transition-transform hover:scale-110"
                >
                    Admin
                </Link>}
                 {user.uid ? (
                        <div
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-2 py-1 transition-transform hover:scale-110"
                            onClick={logOut}
                        >
                            <LogOutIcon /> Log out
                        </div>
                    ) : (
                        <Link
                            href={"/login"}
                            className="cursor-pointerk flex items-center justify-center gap-2 rounded-full border px-2 py-1 transition-transform hover:scale-110"
                        >
                            <LogInIcon /> Log in
                        </Link>
                    )}
            </>
        );
    
    const AboutLinks: React.FC<AboutProps> = () => (
        <>
        <Link href="/mission" className="transition-transform hover:scale-110">
                Our mission
            </Link>
            <Link href="/policy" className="transition-transform hover:scale-110">
                Privacy policy
            </Link>
            <Link href="/terms" className="transition-transform hover:scale-110">
                Terms of use
            </Link>
            <GradientButton>Subscribe to newsletter</GradientButton>
            {user.role !== "psychologist" && (
                <GradientButton
                    onClick={() => {
                        router.push("/appliance");
                    }}
                >
                    Join as a psychologist
                </GradientButton>
            )}
            <Button
                variant="outline"
                className="flex h-fit w-fit items-center justify-between gap-2 bg-transparent px-2 py-1 font-thin"
            >
                <span>English</span>
                <Languages size={20} />
            </Button>
        </>
    );
    
    return (
        <div
            className={clsx(
                "flex min-h-[33vh] flex-wrap items-start justify-center sm:py-10 text-xl gap-4 font-thin text-white w-full",
                variant === "footer" ? "bg-[#525174] gap-14 p-4" : "gap-2 bg-transparent justify-evenly",
            )}
        >
            <div className="flex flex-col gap-2 font-openSans text-white sm:items-start items-center self-center">
                <SocialMediaLinks />
                <Link
                    href={"/"}
                    className="font-playfairDSC text-xl md:text-4xl uppercase"
                >
                    Profypsy
                </Link>
            </div>
            <div className="flex flex-col gap-1 text-base md:text-md items-center ">
                <h4 className="text-xl md:text-2xl underline">About</h4>
                <AboutLinks user={user} router={router} />
            </div>
           
            <div className="flex flex-col gap-1 text-base md:text-md sm:items-start items-center">
                <h4 className="text-xl md:text-2xl underline">Useful Links</h4>
                <UsefulLinks {...user}/>
            </div>
            <div className="hidden sm:flex flex-col gap-1 text-base md:text-md ">
                <h4 className="text-xl md:text-2xl underline">Services</h4>
                <ServicesLinks />
            </div>
            
        </div>
    );
};