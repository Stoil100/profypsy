"use client";

import { useTranslations } from "next-intl";

export default function Mission() {
    const t = useTranslations("Mission");
    return (
        <div className="mx-auto mt-10 max-w-4xl p-5">
            <h1 className="my-5 text-center text-4xl font-bold">
                {t("missionAndVision.title")}
            </h1>

            <section className="my-10">
                <h2 className="mb-3 text-2xl font-bold">
                    {t("missionAndVision.ourMission.title")}
                </h2>
                <p className="px-4 text-lg">
                    {t("missionAndVision.ourMission.description")}
                </p>
            </section>

            <section className="my-10">
                <h2 className="mb-3 text-2xl font-bold">
                    {t("missionAndVision.meaningCreators.title")}
                </h2>
                <p className="px-4 text-lg">
                    {t("missionAndVision.meaningCreators.description")}
                </p>
            </section>

            <section className="my-10">
                <h2 className="mb-3 text-2xl font-bold">
                    {t("missionAndVision.meaningUsers.title")}
                </h2>
                <p className="px-4 text-lg">
                    {t("missionAndVision.meaningUsers.description")}
                </p>
            </section>

            <section className="my-10">
                <h2 className="mb-3 text-2xl font-bold">
                    {t("missionAndVision.meaningPsychologists.title")}
                </h2>
                <p className="px-4 text-lg">
                    {t("missionAndVision.meaningPsychologists.description")}
                </p>
            </section>

            <section className="my-10">
                <h2 className="mb-3 text-2xl font-bold">
                    {t("missionAndVision.visionAndValues.title")}
                </h2>
                <p className="px-4 text-lg">
                    {t("missionAndVision.visionAndValues.description")}
                </p>
            </section>
        </div>
    );
}
