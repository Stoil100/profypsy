import MainButton from "@/components/MainButton";
import StarRating from "@/components/Rating";
import { Badge } from "@/components/ui/badge";
import { PsychologistT } from "@/models/psychologist";
import { LanguagesIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
    profile: PsychologistT;
    onBookNow: () => void;
    t: (args: string) => string;
}

export function ProfileHeader({ profile, onBookNow, t }: ProfileHeaderProps) {
    return (
        <div className="flex flex-wrap gap-4 md:flex-nowrap">
            <div className="flex flex-col items-center justify-center gap-2 max-sm:w-full">
                <img
                    src={profile.image || "/placeholder.svg"}
                    alt={profile.userName}
                    width={192}
                    height={192}
                    className="rounded-full border-4 border-[#25BA9E] p-1"
                />
                <StarRating initialRating={4} />
                <MainButton
                    className="w-full border-2 border-[#25BA9E] text-xl hover:scale-105"
                    onClick={onBookNow}
                >
                    {t("bookNow")}
                </MainButton>
            </div>
            <div className="flex flex-1 flex-col items-center justify-between gap-2 sm:items-start">
                <h2 className="text-4xl max-md:text-center">
                    {profile.userName}
                </h2>
                <div className="flex items-center gap-2">
                    <p className="text-lg text-gray-400">
                        &quot;{profile.quote}&quot;
                    </p>
                    <div className="flex items-center gap-2">
                        <MapPinIcon />
                        <p className="text-xl">{profile.location}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 text-[#40916C]">
                    <div className="flex items-center gap-2">
                        <MailIcon />
                        <p className="text-sm">{profile.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <PhoneIcon />
                        <p className="text-xl">{profile.phone}</p>
                    </div>
                    <div className="flex gap-2 sm:items-start">
                        <LanguagesIcon />
                        {profile.languages?.map((language, index) => (
                            <Badge
                                key={index}
                                className="w-fit border-2 border-[#40916C] bg-[#F1ECCC] p-[2px] text-xl"
                            >
                                <Image
                                    src={
                                        language.toLowerCase() === "bg"
                                            ? "/logic/bg.png"
                                            : "/logic/en.png"
                                    }
                                    alt={language}
                                    width={24}
                                    height={24}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <h4 className="text-2xl">{t("specializations")}:</h4>
                    <div className="flex flex-wrap gap-2">
                        {profile.specializations?.map((speciality, index) => (
                            <Badge
                                key={index}
                                className="border-2 border-[#40916C] bg-[#FCFBF4] text-xl"
                            >
                                <p className="h-full w-full text-nowrap bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-transparent">
                                    {speciality}
                                </p>
                            </Badge>
                        ))}
                    </div>
                </div>
                <hr className="w-full rounded-full border-2 border-[#40916C]" />
                <div className="flex h-fit items-center gap-2">
                    <p className="text-2xl">{t("pricePerHour")}</p>
                    <p className="place-self-center text-4xl font-bold">
                        {profile.price} {t("price")}
                    </p>
                </div>
            </div>
            <Image
                src="/search/hero.png"
                alt="Hero"
                width={320}
                height={320}
                className="hidden w-full max-w-xs flex-1 object-scale-down drop-shadow-[5px_10px_0_rgba(0,0,0,0.25)] xl:block"
            />
        </div>
    );
}
