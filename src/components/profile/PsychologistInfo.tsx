import { ProfileT } from "@/models/profile";

interface PsychologistInfoProps {
    profile: ProfileT;
    t: (args: string) => string;
}

export default function PsychologistInfo({
    profile,
    t,
}: PsychologistInfoProps) {
    return (
        <div className="row-start-2 flex max-h-[calc(100vh-(4rem+40px))] w-full flex-col justify-between gap-4 md:col-span-3 md:!col-start-3 md:row-start-1 xl:col-span-3">
            <Overview profile={profile} t={t} />
            <Background profile={profile} t={t} />
        </div>
    );
}

function Overview({ profile, t }: PsychologistInfoProps) {
    return (
        <div className="flex h-full w-full flex-1 flex-col justify-between gap-4 overflow-y-auto bg-[#FEFFEC] px-2 py-4 drop-shadow-lg transition duration-500 hover:drop-shadow-lg md:px-6 md:drop-shadow-[10px_10px_0_rgba(64,145,108,0.4)]">
            <h3 className="font-playfairDSC text-3xl text-[#40916C] lg:text-5xl">
                {t("overview")}
            </h3>
            <div>
                <p>{t("about")}:</p>
                <p className="w-full break-all rounded-lg border-2 border-dashed border-black p-2 text-center">
                    {profile.about}
                </p>
            </div>
            {profile.specializations && (
                <div>
                    <p>{t("specializations")}:</p>
                    <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-lg border-2 border-dashed border-black p-2">
                        {profile.specializations.map((specialization) => (
                            <p
                                key={specialization}
                                className="rounded bg-[#25BA9E] px-4 py-1 text-white"
                            >
                                {specialization}
                            </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function Background({ profile, t }: PsychologistInfoProps) {
    return (
        <div className="flex h-full w-full flex-1 flex-col justify-between gap-4 overflow-y-auto bg-[#FEFFEC] px-2 py-4 drop-shadow-lg transition duration-500 hover:drop-shadow-lg md:px-6 md:drop-shadow-[10px_10px_0_rgba(64,145,108,0.4)]">
            <h3 className="font-playfairDSC text-3xl text-[#40916C] lg:text-5xl">
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
    );
}
