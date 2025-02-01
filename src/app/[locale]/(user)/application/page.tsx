import ApplicationForm from "@/components/forms/application/Content";
import { useTranslations } from "next-intl";

export default function Application() {
    const t = useTranslations("Pages.Application");
    return (
        <main className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#40916C] to-[#52B788] md:py-4 ">
            <div className="flex flex-col items-center gap-4 bg-white md:p-4 md:drop-shadow-[10px_10px_0_rgba(75,75,75,0.4)]">
                <h2 className="mt-2 max-w-xl text-center font-playfairDSC text-3xl text-[#40916C] md:text-6xl">
                    {t("title")}
                </h2>
                <hr className="w-2/3 rounded-full border-2 border-[#40916C]" />
                <ApplicationForm className="w-full sm:w-[500px] md:w-[600px] lg:w-[700px]" />
            </div>
        </main>
    );
}
