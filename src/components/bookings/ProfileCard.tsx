import { Badge } from "@/components/ui/badge";
import type { PsychologistT } from "@/models/psychologist";
import { Pin, User } from "lucide-react";
import Link from "next/link";
import type React from "react";

type ProfileCardProps = {
    psychologist: PsychologistT;
    t: (args: string) => string;
};
export const ProfileCard: React.FC<ProfileCardProps> = ({
    psychologist,
    t,
}) => {
    return (
        <div className="relative flex w-fit max-w-[300px] flex-col items-center justify-between gap-4 rounded-lg bg-[#FCFBF4] p-6 drop-shadow-xl">
            <Badge
                className={`absolute -left-3 -top-3 text-white ${
                    psychologist.variant === "Deluxe"
                        ? "bg-[#FCD96A]"
                        : psychologist.variant === "Premium"
                          ? "bg-[#FC8A6A]"
                          : psychologist.trial
                            ? "bg-[#99B6ED]"
                            : "border-none bg-gradient-to-b from-[#F7F4E0] to-[#F1ECCC] text-black"
                }`}
            >
                {psychologist.variant === "Deluxe"
                    ? t("bestSuited")
                    : psychologist.variant === "Premium"
                      ? t("recommendedByUs")
                      : psychologist.trial
                        ? t("freshlyFound")
                        : t("strongMatch")}
            </Badge>
            {psychologist.image ? (
                <img
                    src={psychologist.image || "/placeholder.svg"}
                    alt="Profile Image"
                    className="size-28 rounded"
                />
            ) : (
                <div className="size-20 rounded-full border-2 border-dashed border-gray-500 p-4">
                    <User className="h-full w-full text-gray-400" />
                </div>
            )}
            <div className="flex w-full flex-col items-start justify-center gap-2 break-all">
                <h4 className="text-3xl text-[#205041]">
                    {psychologist.userName}
                </h4>
                <div className="flex w-fit items-center justify-center gap-1">
                    <Pin color="#08BF6B" />
                    <p className="text-[#205041]">{psychologist.location}</p>
                </div>
                {psychologist.experiences.map((experience) => (
                    <p
                        className="line-clamp-1 text-[#20504180]"
                        key={experience.id}
                    >
                        {experience.value}
                    </p>
                ))}
                <p className="line-clamp-1 text-[#205041]">
                    {psychologist.about}
                </p>
            </div>
            <Link
                href={`/search/${psychologist.uid}`}
                className="w-full rounded bg-gradient-to-b from-[#40916C] to-[#52B788] py-2 text-center text-white transition-transform hover:md:scale-105"
            >
                {t("bookNow")}
            </Link>
        </div>
    );
};
