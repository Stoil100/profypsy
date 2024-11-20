"use client";

import { UserType } from "@/models/user";
import clsx from "clsx";
import {
    Facebook,
    Instagram,
    LogInIcon,
    LogOutIcon,
    Twitter,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import LanguageSwitcher from "./LanguageButton";
import MainButton from "./MainButton";
import { useAuth } from "./Providers";
import NewsletterForm from "./forms/newsletter";

type LinksProps = {
    t?: (key: string) => string;
    router?: AppRouterInstance;
    user?: UserType;
    logOut?: () => Promise<void>;
};

const SocialMediaLinks = ({ t }: LinksProps) => (
    <div className="flex w-full flex-col items-center justify-center gap-2 self-center font-openSans sm:items-start">
        <Link
            href={"/"}
            className="font-playfairDSC text-5xl uppercase sm:text-6xl"
        >
            {t!("companyName")}
        </Link>
        <div className="flex items-center gap-5 text-[#F1ECCC]">
            <Link href="https://instagram.com" aria-label="Instagram">
                <Instagram className="size-6 md:size-10" absoluteStrokeWidth />
            </Link>
            <Link href="https://facebook.com" aria-label="Facebook">
                <Facebook className="size-8 md:size-10" absoluteStrokeWidth />
            </Link>
            <Link href="https://twitter.com" aria-label="Twitter">
                <Twitter className="size-6 md:size-10" absoluteStrokeWidth />
            </Link>
        </div>
    </div>
);

const UsefulLinks = ({ t, user, logOut }: LinksProps) => (
    <div className="md:text-md flex flex-col gap-3 text-sm sm:text-base md:max-lg:flex-row md:max-lg:items-center md:max-lg:gap-8">
        <h4 className="text-lg underline sm:text-xl md:text-2xl">
            {t!("usefulLinks")}
        </h4>
        <Link href="/search" className="transition-transform hover:scale-110">
            {t!("findTherapist")}
        </Link>
        <Link href="/profile" className="transition-transform hover:scale-110">
            {t!("myProfile")}
        </Link>
        <Link href="/articles" className="transition-transform hover:scale-110">
            {t!("blog")}
        </Link>
        {user!.admin && (
            <Link
                href="/admin"
                className="transition-transform hover:scale-110"
            >
                {t!("admin")}
            </Link>
        )}
        {user!.uid ? (
            <div
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-2 py-1 transition-transform hover:scale-110"
                onClick={logOut}
            >
                <LogOutIcon /> {t!("logOut")}
            </div>
        ) : (
            <Link
                href={"/login"}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full border px-2 py-1 transition-transform hover:scale-110"
            >
                <LogInIcon /> {t!("logIn")}
            </Link>
        )}
    </div>
);

const AboutLinks = ({ t, router, user }: LinksProps) => (
    <div className="md:text-md flex flex-col items-start gap-3 text-sm sm:text-base ">
        <h4 className="text-xl underline md:text-2xl">{t!("about")}</h4>
        <Link href="/mission" className="transition-transform hover:scale-110">
            {t!("ourMission")}
        </Link>
        <Link href="/policy" className="transition-transform hover:scale-110">
            {t!("privacyPolicy")}
        </Link>
        <Link href="/terms" className="transition-transform hover:scale-110">
            {t!("termsOfUse")}
        </Link>
        {user!.role !== "psychologist" && (
            <MainButton
                onClick={() => {
                    router!.push("/application");
                }}
            >
                {t!("joinAsPsychologist")}
            </MainButton>
        )}
        <LanguageSwitcher />
    </div>
);

const Newsletter = ({ t }: LinksProps) => {
    return (
        <div className="md:text-md  space-y-2 text-base">
            <h6 className="text-xl underline md:text-2xl">
                {t!("newsletter.title")}
            </h6>
            <p>{t!("newsletter.description")}</p>
            <NewsletterForm />
        </div>
    );
};

export const Footer: React.FC = () => {
    const t = useTranslations("Navigation");
    const { user, logOut } = useAuth();
    const router = useRouter();

    return (
        <div className="flex min-h-[33vh] w-full flex-wrap justify-center gap-x-4 gap-y-8 bg-[#525174] p-4 text-xl font-thin text-white sm:gap-14 sm:py-10">
            <div className="space-y-8 self-center sm:space-y-6">
                <SocialMediaLinks t={t} />
                <Newsletter t={t} />
            </div>
            <AboutLinks t={t} user={user} router={router} />
            <UsefulLinks t={t} user={user} router={router} logOut={logOut} />
        </div>
    );
};
