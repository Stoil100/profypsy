import MainButton from "@/components/MainButton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ProfileT } from "@/models/profile";
import { UserType } from "@/models/user";
import {
    LanguagesIcon,
    MailIcon,
    MapPinIcon,
    PhoneIcon,
    User,
    PenIcon as UserPenIcon,
} from "lucide-react";
import { useState } from "react";
import ApplicationForm from "../forms/application/Content";

interface UserInfoProps {
    profile: ProfileT;
    user: UserType;
    t: (args: string) => string;
}

export default function UserInfo({ profile, user, t }: UserInfoProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div
            className={cn(
                "relative flex w-full flex-col items-center justify-between gap-8 bg-[#FEFFEC] px-2 py-4 drop-shadow-lg transition duration-500 hover:drop-shadow-lg md:col-span-2 md:max-h-[calc(100vh-(4rem+40px))] md:px-6 md:drop-shadow-[10px_10px_0_rgba(64,145,108,0.4)]",
                user.role !== "psychologist" && "w-full md:w-fit",
            )}
        >
            {user.role === "psychologist" && (
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                    <DialogTrigger asChild>
                        <MainButton className="absolute left-2 top-2 z-10 cursor-pointer border-2 border-[#25BA9E] px-1 py-1">
                            <UserPenIcon />
                        </MainButton>
                    </DialogTrigger>
                    <DialogContent className="mt-8 max-h-[90vh] max-w-3xl overflow-y-scroll">
                        <ApplicationForm
                            profile={profile}
                            setIsEditing={setIsEditing}
                        />
                    </DialogContent>
                </Dialog>
            )}
            <UserAvatar profile={profile} />
            <UserDetails profile={profile} user={user} t={t} />
        </div>
    );
}

interface UserAvatarProps {
    profile: ProfileT;
}

function UserAvatar({ profile }: UserAvatarProps) {
    return (
        <div className="relative flex h-fit flex-col items-center justify-center gap-1 text-center">
            {profile.image ? (
                <img
                    src={profile.image! || "/placeholder.svg"}
                    alt={profile.userName}
                    className="aspect-square w-full rounded-full border-4 border-[#25BA9E] p-1 shadow-xl"
                />
            ) : (
                <div className="max-w-72 rounded-full border-2 p-4">
                    <User size={42} />
                </div>
            )}
            {profile.variant && (
                <div className="mt-1 flex items-center gap-4">
                    <Badge
                        className={cn(
                            profile.variant === "Deluxe"
                                ? "bg-[#FCD96A]"
                                : profile.variant === "Premium"
                                  ? "bg-[#FC8A6A]"
                                  : profile.variant === "Basic"
                                    ? "bg-[#99B6ED]"
                                    : "border-none bg-gradient-to-b from-[#F7F4E0] to-[#F1ECCC] text-black",
                        )}
                    >
                        {profile.variant}
                    </Badge>
                </div>
            )}
            {profile.userName && (
                <h2 className="text-3xl text-[#205041]">{profile.userName}</h2>
            )}
            {profile.quote && (
                <p className="italic text-gray-500">
                    &quot;{profile.quote}&quot;
                </p>
            )}
        </div>
    );
}

interface UserDetailsProps extends UserInfoProps {
    t: (key: string) => string;
}

function UserDetails({ profile, user, t }: UserDetailsProps) {
    return (
        <div className="grid w-full grid-cols-2 grid-rows-3 gap-2 text-white">
            <div className="col-span-2 flex items-center justify-between gap-2 rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1">
                <MailIcon />
                <p>
                    {user.email} {user.email !== profile.email && profile.email}
                </p>
            </div>
            <div className="row-start-2 flex items-center justify-between rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1">
                <MapPinIcon />
                <p>{profile.location}</p>
            </div>
            <div className="row-start-2 flex items-center justify-between rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1">
                <PhoneIcon size={20} />
                <p>{user.phone !== profile.phone && profile.phone}</p>
            </div>
            <div className="row-start-3 flex items-center justify-between rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1">
                <p>{t("age")}:</p>
                <p>{profile.age}</p>
            </div>
            <div className="row-start-3 flex items-center justify-between rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1">
                <LanguagesIcon />
                <div className="flex gap-2">
                    {profile.languages?.map((language, index) => (
                        <Badge
                            className="w-fit border-2 border-[#40916C] bg-[#F1ECCC] p-[2px] text-xl"
                            key={index}
                        >
                            <img
                                src={
                                    language === "bg"
                                        ? "/logic/bg.png"
                                        : "/logic/en.png"
                                }
                                alt={language}
                                className="w-6"
                            />
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
