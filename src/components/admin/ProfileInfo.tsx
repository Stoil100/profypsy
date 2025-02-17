import { Button } from "@/components/ui/button";
import { db } from "@/firebase/config";
import type { PsychologistT } from "@/models/psychologist";
import { doc, updateDoc, writeBatch } from "firebase/firestore";
import {
    LanguagesIcon,
    MailIcon,
    MapPinIcon,
    PhoneIcon,
    Trash2Icon,
    User,
} from "lucide-react";
import type React from "react";
import { Badge } from "../ui/badge";

type ProfileInfoProps = {
    profile: PsychologistT;
    t: (args: string) => string;
};

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, t }) => {
    const approvePsychologist = async (uid: string) => {
        const psychologistsRef = doc(db, "psychologists", uid);
        await updateDoc(psychologistsRef, {
            approved: true,
        });
    };

    const denyPsychologist = async (uid: string) => {
        const psychologistsRef = doc(db, "psychologists", uid);
        await updateDoc(psychologistsRef, {
            approved: false,
        });
    };

    const deletePsychologist = async (uid: string) => {
        const psychologistsRef = doc(db, "psychologists", uid);
        const userRef = doc(db, "users", uid);

        const batch = writeBatch(db);

        batch.delete(psychologistsRef);
        batch.update(userRef, { role: "user" });

        await batch.commit();
    };

    return (
        <div className="flex h-fit w-full flex-col gap-4 rounded-lg bg-gray-400/20 p-2">
            <div className="flex h-fit w-full items-center gap-2 py-4 max-lg:flex-col">
                <div className="flex w-full flex-col items-center justify-between gap-8 px-2 py-4 drop-shadow-lg md:px-6 lg:w-1/3">
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
                        {profile.userName && (
                            <h2 className="text-3xl text-[#205041]">
                                {profile.userName}
                            </h2>
                        )}
                        {profile.quote && (
                            <p className="italic text-gray-500">
                                &quot;{profile.quote}&quot;
                            </p>
                        )}
                    </div>
                    <div className="grid w-full grid-cols-2 grid-rows-3 gap-2 text-white">
                        <div className="col-span-2 flex items-center justify-between gap-2 rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1">
                            <MailIcon />
                            <p>{profile.email}</p>
                        </div>
                        <div className="row-start-2 flex items-center justify-between rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1">
                            <MapPinIcon />
                            <p>{profile.location}</p>
                        </div>
                        <div className="row-start-2 flex items-center justify-between rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1">
                            <PhoneIcon size={20} />
                            <p>{profile.phone}</p>
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
                </div>
                <div className="max-h-screen w-full overflow-y-auto drop-shadow-lg  lg:w-1/3">
                    <div className="flex h-full w-full flex-1 flex-col justify-between gap-4 overflow-y-auto px-2 py-4 md:px-6 ">
                        <h3 className="font-playfairDSC text-3xl">
                            {t("overview")}
                        </h3>
                        <div>
                            <p>{t("about")}</p>
                            <p className="w-full break-all rounded-lg border-2 border-dashed border-black p-2 text-center">
                                {profile.about}
                            </p>
                        </div>
                        {profile.specializations && (
                            <div>
                                <p>{t("specializations")}</p>
                                <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-lg border-2 border-dashed border-black p-2">
                                    {profile.specializations.map(
                                        (specialization) => (
                                            <p
                                                key={specialization}
                                                className="rounded bg-[#25BA9E] px-4 py-1 text-white"
                                            >
                                                {specialization}
                                            </p>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex h-full w-full flex-1 flex-col justify-between gap-4 overflow-y-auto px-2 py-4 md:px-6">
                        <h3 className="font-playfairDSC text-3xl">
                            {t("background")}
                        </h3>
                        {profile.educations && (
                            <div>
                                <p>{t("education")}</p>
                                <div className="flex w-full flex-wrap items-center justify-center gap-2 break-all rounded-lg border-2 border-dashed border-black p-2">
                                    {profile.educations.map((education) => (
                                        <p
                                            key={education.id}
                                            className="rounded bg-[#25BA9E] px-4 py-1 text-white"
                                        >
                                            {education.value}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                        {profile.experiences && (
                            <div>
                                <p>{t("experience")}</p>
                                <div className="flex w-full flex-wrap items-center justify-center gap-2 break-all rounded-lg border-2 border-dashed border-black p-2">
                                    {profile.experiences.map((experience) => (
                                        <p
                                            key={experience.id}
                                            className="rounded bg-[#25BA9E] px-4 py-1 text-white"
                                        >
                                            {experience.value}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="max-h-screen space-y-8 overflow-y-auto px-2 py-4 drop-shadow-lg md:px-6 lg:w-1/3">
                    <h3 className="font-playfairDSC text-3xl">
                        {t("documents")}
                    </h3>
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        <iframe src={profile.cv} />
                        <iframe src={profile.diploma} />
                        <iframe src={profile.letter} />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {profile.approved ? (
                    <Button
                        onClick={() => denyPsychologist(profile.uid)}
                        className="w-full"
                    >
                        {t("deny")}
                    </Button>
                ) : (
                    <Button
                        onClick={() => approvePsychologist(profile.uid)}
                        className="w-full"
                    >
                        {t("approve")}
                    </Button>
                )}
                <Button
                    onClick={() => deletePsychologist(profile.uid)}
                    variant="destructive"
                >
                    <Trash2Icon />
                </Button>
            </div>
        </div>
    );
};
