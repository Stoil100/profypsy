import ApplicationForm from "@/components/schemas/application";
import { useTranslations } from "next-intl";

export default function application() {
    const t = useTranslations("Auth.application");
    return (
        <main className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#40916C] to-[#52B788] py-[10vh]">
            <div className="flex flex-col items-center gap-4 rounded-2xl border-8 border-[#525174] bg-[#F1ECCC] p-4">
                <h2 className="max-w-xl text-center font-playfairDSC text-6xl text-[#40916C]">
                    {t("application")}
                </h2>
                <hr className="w-2/3 rounded-full border-2 border-[#40916C]" />
                <ApplicationForm className="w-full sm:w-[500px] md:w-[600px] lg:w-[700px]" />
            </div>
        </main>
    );
}
