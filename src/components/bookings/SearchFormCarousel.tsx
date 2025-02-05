
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { SearchSchemaType } from "../schemas/search";
import { SupportSelector } from "./SupportSelector";
import { LanguageSelector } from "./LanguageSelector";
import { ConcernSelector } from "./ConcernSelector";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import MainButton from "../MainButton";

interface SearchFormProps {
    form: UseFormReturn<SearchSchemaType>
    t: (args: string) => string;
}

export const SearchFormCarousel: React.FC<SearchFormProps> = ({
    form,
    t,
}) => {

    const [api, setApi] = useState<CarouselApi>();
    const scrollNext = () => api?.scrollNext();

    return (
        <Carousel
            setApi={setApi}
            opts={{ watchDrag: false }}
            className="absolute top-10"
        >
            <CarouselContent className=" w-screen">
                <CarouselItem className="pb-2 w-screen">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-5 text-[#205041]">
                        <h2 className="px-2 text-center font-playfairDSC text-2xl capitalize text-[#205041] md:text-4xl">
                            {t("findRightForYou")}
                        </h2>
                        <ul className="text-md list-decimal pl-10 font-semibold text-[#205041] md:text-xl">
                            <li>{t("tellUsWhatIsOnYourMind")}</li>
                            <li>{t("findPsychologist")}</li>
                            <li>{t("bookYourSession")}</li>
                        </ul>
                        <img
                            src="/logic/search.png"
                            className="max-h-[200px] md:max-h-[400px]"
                            alt={t("findRightForYou")}
                        />
                        <MainButton
                            className="text-xl md:text-3xl"
                            onClick={scrollNext}
                        >
                            {t("getStarted")}
                        </MainButton>
                    </div>
                </CarouselItem>
                <SupportSelector form={form} t={t} scrollNext={scrollNext} />
                <LanguageSelector form={form} t={t} scrollNext={scrollNext} />
                <ConcernSelector form={form} t={t} />
     
            </CarouselContent>
        </Carousel>
    );
};
