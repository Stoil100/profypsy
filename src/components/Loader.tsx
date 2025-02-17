import { SearchCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Loader() {
    const t = useTranslations("Common.loader");
    return (
        <div className="fixed top-0 z-[9999] flex h-screen w-full flex-col items-center justify-center gap-5 bg-[#FCFBF4]">
            <SearchCheck className="animate-bounce text-[#205041]" size={90} />
            <h2 className="font-playfairDSC text-5xl text-[#205041]">
                {t("loadingSelection")}
            </h2>
            <p className="text-xl text-[#128665]">{t("tailoredSearch")}</p>
        </div>
    );
}
