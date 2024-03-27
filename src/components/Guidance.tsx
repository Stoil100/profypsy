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
import GradientButton from "./GradientButton";
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

const SocialMediaLinks = () => (
    <div className="flex w-full items-center justify-between text-[#F1ECCC]">
        <Link href="https://instagram.com" aria-label="Instagram">
            <Instagram size={48} absoluteStrokeWidth />
        </Link>
        <Link href="https://facebook.com" aria-label="Facebook">
            <Facebook size={48} absoluteStrokeWidth />
        </Link>
        <Link href="https://twitter.com" aria-label="Twitter">
            <Twitter size={48} absoluteStrokeWidth />
        </Link>
    </div>
);

const ServicesLinks = () => (
    <>
        <Link href="/search" className="transition-transform hover:scale-110">
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

const UsefulLinks = () => (
    <>
        <Link href="/search" className="transition-transform hover:scale-110">
            Find a therapist
        </Link>
        <Link href="/profile" className="transition-transform hover:scale-110">
            My profile
        </Link>
        <Link href="/articles" className="transition-transform hover:scale-110">
            Blog
        </Link>
    </>
);

const AboutLinks: React.FC<AboutProps> = ({ user, router }) => (
    <>
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

export const Guidance: React.FC<GuidanceProps> = ({ variant }) => {
    const { user, logOut } = useAuth();
    const router = useRouter();
    return (
        <div
            className={clsx(
                "flex min-h-[33vh] flex-wrap items-start justify-center gap-14 py-10 text-xl font-thin text-white",
                variant === "footer" ? "bg-[#525174]" : "bg-transparent",
            )}
        >
            <div className="flex flex-col gap-2 font-openSans text-white">
                <SocialMediaLinks />
                <Link
                    href={"/"}
                    className="font-playfairDSC text-3xl uppercase"
                >
                    Profypsy
                </Link>
                <p>Str. Macedonia #58G</p>
                <p>Sofia, 1000</p>
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
            </div>
            <div className="flex flex-col gap-1">
                <h4 className="text-2xl">Services</h4>
                <ServicesLinks />
            </div>
            <div className="flex flex-col gap-1">
                <h4 className="text-2xl">Useful Links</h4>
                <UsefulLinks />
            </div>
            <div className="flex flex-col gap-1">
                <h4 className="text-2xl">About</h4>
                <AboutLinks user={user} router={router} />
            </div>
        </div>
    );
};
