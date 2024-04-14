"use client";

import { UserType } from "@/models/user";
import clsx from "clsx";
import {
    Facebook,
    Instagram,
    Languages,
    LogInIcon,
    LogOutIcon,
    Twitter,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import GradientButton from "./MainButton";
import { useAuth } from "./Providers";
import { Button } from "./ui/button";

interface GuidanceProps {
    variant: "footer" | "navigation";
}
interface AboutProps {
    user: UserType;
    router: AppRouterInstance;
}

export const Guidance: React.FC<GuidanceProps> = ({ variant }) => {
    const t =  useTranslations("Navigation");
    const { user, logOut } = useAuth();
    const router = useRouter();
    const SocialMediaLinks = () => (
        <div className="flex w-full items-center justify-between gap-5 text-[#F1ECCC]">
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
            <Link
                href="/search"
                className="text-inherit transition-transform hover:scale-110"
            >
                {t('Services.You')}
            </Link>
            <Link
                href="/search"
                className="transition-transform hover:scale-110"
            >
                Couples
            </Link>
            <Link
                href="/search"
                className="transition-transform hover:scale-110"
            >
                Families
            </Link>
        </>
    );

    const UsefulLinks: React.FC<UserType> = (user) => (
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
            {user.admin && (
                <Link
                    href="/admin"
                    className="transition-transform hover:scale-110"
                >
                    Admin
                </Link>
            )}
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
            <Link
                href="/mission"
                className="transition-transform hover:scale-110"
            >
                Our mission
            </Link>
            <Link
                href="/policy"
                className="transition-transform hover:scale-110"
            >
                Privacy policy
            </Link>
            <Link
                href="/terms"
                className="transition-transform hover:scale-110"
            >
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
                "flex min-h-[33vh] w-full flex-wrap items-start justify-center gap-4 text-xl font-thin text-white sm:py-10",
                variant === "footer"
                    ? "gap-14 bg-[#525174] p-4"
                    : "justify-evenly gap-2 bg-transparent",
            )}
        >
            <div className="flex flex-col items-center gap-2 self-center font-openSans text-white sm:items-start">
                <SocialMediaLinks />
                <Link
                    href={"/"}
                    className="font-playfairDSC text-xl uppercase md:text-4xl"
                >
                    Profypsy
                </Link>
            </div>
            <div className="md:text-md flex flex-col items-center gap-1 text-base ">
                <h4 className="text-xl underline md:text-2xl">About</h4>
                <AboutLinks user={user} router={router} />
            </div>

            <div className="md:text-md flex flex-col items-center gap-1 text-base sm:items-start">
                <h4 className="text-xl underline md:text-2xl">Useful Links</h4>
                <UsefulLinks {...user} />
            </div>
            <div className="md:text-md hidden flex-col gap-1 text-base sm:flex ">
                <h4 className="text-xl underline md:text-2xl">Services</h4>
                <ServicesLinks />
            </div>
        </div>
    );
};
