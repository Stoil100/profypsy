import MainButton from "@/components/MainButton";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { LanguageSelector } from "./LanguageSelector";
import { OptionComponent } from "./OptionComponent";

interface OptionsSectionProps {
    fetchItems: () => void;
    t: (args: string) => string;
}

export const OptionsSection: React.FC<OptionsSectionProps> = ({
    fetchItems,
    t,
}) => {
    const [api, setApi] = useState<CarouselApi>();
    const [draggedValue, setDraggedValue] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<
        "you" | "couples" | "families" | undefined
    >();

    const scrollNext = () => api?.scrollNext();

    return (
        <Carousel
            setApi={setApi}
            opts={{ watchDrag: false }}
            className="fixed top-10 flex h-screen w-screen items-center"
        >
            <CarouselContent>
                <CarouselItem className="pb-2">
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
                <CarouselItem className="pb-2">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-1 px-2">
                        <h2 className="text-center font-playfairDSC text-3xl capitalize text-[#205041] md:text-4xl">
                            {t("whoIsTheSupportFor")}
                        </h2>
                        <div className="w-full max-w-[500px] space-y-4">
                            <OptionComponent
                                name={t("forYou")}
                                iconSrc="/search/person.png"
                                isSelected={selectedOptions === "you"}
                                onSelect={() => setSelectedOptions("you")}
                            />
                            <OptionComponent
                                name={t("forCouples")}
                                iconSrc="/search/couples.png"
                                isSelected={selectedOptions === "couples"}
                                onSelect={() => setSelectedOptions("couples")}
                            />
                            <OptionComponent
                                name={t("forFamilies")}
                                iconSrc="/search/families.png"
                                isSelected={selectedOptions === "families"}
                                onSelect={() => setSelectedOptions("families")}
                            />
                        </div>
                        <MainButton
                            className="text-xl md:text-3xl"
                            onClick={scrollNext}
                        >
                            {t("next")}
                        </MainButton>
                    </div>
                </CarouselItem>
                <CarouselItem className="pb-2">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-1">
                        <h2 className="text-center font-playfairDSC text-3xl capitalize text-[#205041] md:text-4xl">
                            {t("languagePreference")}
                        </h2>
                        <div className="flex w-full max-w-[500px] flex-col items-center gap-4 px-2">
                            <LanguageSelector
                                language={t("bulgarian")}
                                imageSrc="/logic/bg.png"
                            />
                            <LanguageSelector
                                language={t("english")}
                                imageSrc="/logic/en.png"
                            />
                        </div>
                        <MainButton
                            className="text-xl md:text-3xl"
                            onClick={scrollNext}
                        >
                            {t("next")}
                        </MainButton>
                    </div>
                </CarouselItem>
                <CarouselItem className="pb-2">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-4">
                        <h2 className="text-center font-playfairDSC text-2xl capitalize text-[#205041] md:text-4xl">
                            {t("howMuchDoesItConcernYou")}
                        </h2>
                        <p className="bg-gradient-to-b from-[#6DD864] to-[#23A53D] bg-clip-text text-transparent">
                            {t("dragFromLeftToRight")}
                        </p>
                        <div className="w-full max-w-[500px] space-y-4">
                            <div className="flex h-[40px] rounded-full border-2 border-white">
                                <div
                                    className="flex w-1/3 items-center justify-center rounded-l-full bg-[#08BF6B] text-white"
                                    onClick={() => {
                                        setDraggedValue(0);
                                    }}
                                >
                                    {t("aLittle")}
                                </div>
                                <div
                                    className={`flex w-1/3 items-center justify-center text-[#FCD96A] transition-colors duration-300 ${draggedValue >= 50 && "bg-[#FCD96A] text-white"}`}
                                    onClick={() => {
                                        setDraggedValue(50);
                                    }}
                                >
                                    {t("moderate")}
                                </div>
                                <div
                                    className={`flex w-1/3 items-center justify-center rounded-r-full text-[#FC8A6A] transition-colors duration-300 ${draggedValue >= 100 && "bg-[#FC8A6A] text-white"}`}
                                    onClick={() => {
                                        setDraggedValue(100);
                                    }}
                                >
                                    {t("quiteMuch")}
                                </div>
                            </div>
                            <Slider
                                onValueChange={(value) => {
                                    setDraggedValue(value[0]);
                                }}
                                defaultValue={[0]}
                                max={100}
                                step={50}
                                className="w-full"
                                value={[draggedValue]}
                            />
                        </div>
                        <MainButton
                            className="text-xl md:text-3xl"
                            onClick={fetchItems}
                        >
                            {t("finishUp")}
                        </MainButton>
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
};
