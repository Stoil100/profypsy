"use client";

import { cn } from "@/lib/utils";
import { ProfileT } from "@/models/profile";
import { UserType } from "@/models/user";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import AppointmentsSection from "./AppointmentsSection";
import PsychologistInfo from "./PsychologistInfo";
import UserInfo from "./UserInfo";
import { fetchProfile } from "./utils";

interface ProfileContentProps {
    user: UserType;
}

export default function ProfileContent({ user }: ProfileContentProps) {
    const t = useTranslations("Pages.Profile");
    const [profile, setProfile] = useState<ProfileT>();

    useEffect(() => {
        if (user.uid) {
            fetchProfile(user.uid, user.role!, setProfile);
        }
    }, [user.uid, user.role]);

    if (!profile) return null;

    return (
        <div
            className={cn(
                "grid w-full grid-cols-1 grid-rows-3 gap-6 px-2 md:grid-cols-5 md:grid-rows-2 md:px-6 xl:grid-cols-8 xl:grid-rows-1",
                user.role !== "psychologist" && "flex flex-wrap justify-center",
            )}
        >
            <UserInfo profile={profile} user={user} t={t} />
            {user.role === "psychologist" && (
                <PsychologistInfo profile={profile} t={t} />
            )}
            <AppointmentsSection user={user} profile={profile} t={t} />
        </div>
    );
}
