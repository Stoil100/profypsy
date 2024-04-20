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
import LanguageSwitcher from "./LanguageButton";

interface GuidanceProps {
    variant: "footer" | "navigation";
}
export const Guidance: React.FC<GuidanceProps> = ({ variant }) => {
    const t = useTranslations("Navigation");
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
                {t("you")}
            </Link>
            <Link
                href="/search"
                className="transition-transform hover:scale-110"
            >
                {t("couples")}
            </Link>
            <Link
                href="/search"
                className="transition-transform hover:scale-110"
            >
                {t("families")}
            </Link>
        </>
    );

    const UsefulLinks = () => (
        <>
            <Link
                href="/search"
                className="transition-transform hover:scale-110"
            >
                {t("findTherapist")}
            </Link>
            <Link
                href="/profile"
                className="transition-transform hover:scale-110"
            >
                {t("myProfile")}
            </Link>
            <Link
                href="/articles"
                className="transition-transform hover:scale-110"
            >
                {t("blog")}
            </Link>
            {user.admin && (
                <Link
                    href="/admin"
                    className="transition-transform hover:scale-110"
                >
                    {t("admin")}
                </Link>
            )}
            {user.uid ? (
                <div
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-2 py-1 transition-transform hover:scale-110"
                    onClick={logOut}
                >
                    <LogOutIcon /> {t("logOut")}
                </div>
            ) : (
                <Link
                    href={"/login"}
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-2 py-1 transition-transform hover:scale-110"
                >
                    <LogInIcon /> {t("logIn")}
                </Link>
            )}
        </>
    );

    const AboutLinks = () => (
        <>
            <Link
                href="/mission"
                className="transition-transform hover:scale-110"
            >
                {t("ourMission")}
            </Link>
            <Link
                href="/policy"
                className="transition-transform hover:scale-110"
            >
                {t("privacyPolicy")}
            </Link>
            <Link
                href="/terms"
                className="transition-transform hover:scale-110"
            >
                {t("termsOfUse")}
            </Link>
            <GradientButton>{t("subscribeToNewsletter")}</GradientButton>
            {user.role !== "psychologist" && (
                <GradientButton
                    onClick={() => {
                        router.push("/appliance");
                    }}
                >
                    {t("joinAsPsychologist")}
                </GradientButton>
            )}
            <LanguageSwitcher/>
        </>
    );

    return (
        <div
            className={clsx(
                "flex min-h-[33vh] w-full flex-wrap text-xl font-thin text-white sm:py-10",
                variant === "footer"
                    ? "gap-14 bg-[#525174] p-4 justify-center"
                    : "justify-evenly gap-2 bg-transparent",
            )}
        >
            <div className="flex flex-col items-center gap-2 self-center font-openSans sm:items-start">
                <SocialMediaLinks />
                <Link
                    href={"/"}
                    className="font-playfairDSC text-xl uppercase md:text-4xl"
                >
                    {t("companyName")}
                </Link>
            </div>
            <div className="md:text-md flex flex-col items-center gap-1 text-base ">
                <h4 className="text-xl underline md:text-2xl">{t("about")}</h4>
                <AboutLinks />
            </div>

            <div className="md:text-md flex flex-col items-center gap-1 text-base sm:items-start">
                <h4 className="text-xl underline md:text-2xl">
                    {t("usefulLinks")}
                </h4>
                <UsefulLinks />
            </div>
            <div className="md:text-md hidden flex-col gap-1 text-base sm:flex ">
                <h4 className="text-xl underline md:text-2xl">
                    {t("services")}
                </h4>
                <ServicesLinks />
            </div>
        </div>
    );
};
