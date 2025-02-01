import { PsychologistT } from "@/models/psychologist";

interface ProfileDetailsProps {
    profile: PsychologistT;
    t: (args: string) => string;
}

export function ProfileDetails({ profile, t }: ProfileDetailsProps) {
    return (
        <div className="h-max w-full space-y-4 rounded-lg px-2 font-openSans">
            <div className="space-y-2">
                <h3 className="text-4xl">{t("aboutMe")}</h3>
                <p className="px-2 text-lg">{profile.about}</p>
            </div>
            <hr className="w-full rounded-full border-2 border-[#25BA9E]" />
            <div className="flex w-full flex-wrap gap-2">
                <div className="flex-1">
                    <h4 className="text-2xl">{t("education")}</h4>
                    <ul className="list-inside list-disc divide-y-2 rounded-xl p-2 px-4 text-left">
                        {profile.educations.map((education) => (
                            <li
                                key={education.id}
                                className="line-clamp-2 list-item text-xl capitalize"
                            >
                                {education.value}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1">
                    <h4 className="text-2xl">{t("workExperience")}</h4>
                    <ul className="list-inside list-disc divide-y-2 rounded-xl p-2 px-4 text-left">
                        {profile.experiences.map((experience) => (
                            <li
                                key={experience.id}
                                className="line-clamp-2 list-item text-xl capitalize"
                            >
                                {experience.value}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
