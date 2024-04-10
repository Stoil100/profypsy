"use client";

import GradientButton from "@/components/MainButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { db } from "@/firebase/config";
import { cn } from "@/lib/utils";
// import { ListProfile, ListProfiles } from "@/models/listProfile";
import { PsychologistProfile } from "@/components/forms/appliance";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { ChevronRight, Pin, SearchCheck, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/Providers";
import { useRouter } from "next/navigation";
interface OptionProps {
    name: string;
    iconSrc: string;
    isSelected: boolean;
    onSelect: () => void;
}
const OptionComponent: React.FC<OptionProps> = ({
    name,
    iconSrc,
    isSelected,
    onSelect,
}) => (
    <div
        onClick={onSelect}
        className={cn(
            "flex cursor-pointer items-center space-x-2 rounded-lg bg-[#FCFBF4] p-1 drop-shadow-lg transition-all hover:md:scale-110",
            isSelected &&
                "bg-gradient-to-r from-[#23A53D] to-[#6DD864] text-white",
        )}
    >
        <img src={iconSrc} className="size-16 md:size-20" />
        <p className="text-md md:text-xl">{name}</p>
        <ChevronRight />
    </div>
);

const LanguageSelector: React.FC<{ language: string; imageSrc: string }> = ({
    language,
    imageSrc,
}) => {
    const [isChecked, setIsChecked] = useState(false);

    const toggleCheckbox = () => setIsChecked(!isChecked);

    return (
        <div
            className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-lg bg-[#FCFBF4] p-2 drop-shadow-lg transition-all hover:md:scale-110",
                isChecked &&
                    "bg-gradient-to-r from-[#23A53D] to-[#6DD864] text-white",
            )}
            onClick={toggleCheckbox}
        >
            <Checkbox id={language} checked={isChecked} />
            <div
                className="flex items-center justify-center gap-2"
                onClick={toggleCheckbox}
            >
                <img src={imageSrc} />
                <p className="text-xl">{language}</p>
            </div>
        </div>
    );
};

const HelpSelector: React.FC<{ option: string }> = ({ option }) => {
    const [isChecked, setIsChecked] = useState(false);

    const toggleCheckbox = () => setIsChecked(!isChecked);

    return (
        <div
            className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded-lg bg-[#FCFBF4] p-2 drop-shadow-lg transition-all hover:md:scale-110",
                isChecked &&
                    "bg-gradient-to-r from-[#23A53D] to-[#6DD864] text-white",
            )}
            onClick={toggleCheckbox}
        >
            <Checkbox id={option} checked={isChecked} />
            <p className="text-md md:text-xl" onClick={toggleCheckbox}>
                {option}
            </p>
        </div>
    );
};
const ProfileCard = ({
    userName,
    location,
    image,
    about,
    experiences,
    variant,
    uid,
    trial,
}: PsychologistProfile) => (
    <div className="relative flex w-fit max-w-[300px] flex-col items-center justify-between gap-4 rounded-3xl bg-[#FCFBF4] p-6">
        <Badge
            className={cn(
                "absolute -left-3 -top-3 text-white",
                variant === "Deluxe"
                    ? "bg-[#FCD96A]"
                    : variant === "Premium"
                      ? "bg-[#FC8A6A]"
                      : trial
                        ? "bg-[#99B6ED]"
                        : "border-none bg-gradient-to-b from-[#F7F4E0] to-[#F1ECCC] text-black",
            )}
        >
            {variant === "Deluxe"
                ? "Best suited"
                : variant === "Premium"
                  ? "Recommended by us"
                  : trial
                    ? "Freshly found"
                    : "Strong match"}
        </Badge>
        {image ? (
            <img src={image} className="size-28 rounded" />
        ) : (
            <div className="size-20 rounded-full border-2 border-dashed border-gray-500 p-4">
                <User className="h-full w-full text-gray-400" />
            </div>
        )}
        <div className="flex w-full flex-col items-start justify-center gap-2 break-all">
            <h4 className="text-3xl text-[#205041]">
                {userName.firstName} {userName.lastName}
            </h4>
            <div className="flex  w-fit items-center justify-center gap-1">
                <Pin color="#08BF6B" />
                <p className="text-[#205041]">{location}</p>
            </div>
            {experiences.map((experience, index) => (
                <p className="line-clamp-1 text-[#20504180] " key={index}>
                    {experience.experience}
                </p>
            ))}
            <p className="line-clamp-1 text-[#205041]">{about}</p>
        </div>
        <Link
            href={`/search/${uid}`}
            className="w-full rounded-xl bg-gradient-to-b from-[#40916C] to-[#52B788] py-2 text-center text-white transition-transform hover:md:scale-110"
        >
            Book Now
        </Link>
    </div>
);

type OptionsSectionProps = { fetchItems: () => void };

const OptionsSection = ({ fetchItems }: OptionsSectionProps) => {
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
                    <div className="text-[#205041 flex h-full w-full flex-col items-center justify-center gap-5">
                        <h2 className="px-2 text-center font-playfairDSC text-2xl capitalize text-[#205041] md:text-4xl">
                            Lets find what’s right for you
                        </h2>
                        <ul className="text-md list-decimal pl-10 font-semibold text-[#205041] md:text-xl">
                            <li>Tell us what is on your mind</li>
                            <li>Find a psychologist that suits you</li>
                            <li>Book your session</li>
                        </ul>
                        <img
                            src="/logic/search.png"
                            className="max-h-[200px] md:max-h-[400px]"
                        />
                        <GradientButton
                            className="text-xl md:text-3xl"
                            onClick={scrollNext}
                        >
                            Get Started
                        </GradientButton>
                    </div>
                </CarouselItem>
                <CarouselItem className="pb-2">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-1 px-2">
                        <h2 className="text-center font-playfairDSC text-3xl capitalize text-[#205041] md:text-4xl">
                            Who is the support for you?
                        </h2>
                        <div className="w-full max-w-[500px] space-y-4">
                            <OptionComponent
                                name="For you"
                                iconSrc="/homepage/person.png"
                                isSelected={selectedOptions === "you"}
                                onSelect={() => setSelectedOptions("you")}
                            />
                            <OptionComponent
                                name="For couples"
                                iconSrc="/homepage/couples.png"
                                isSelected={selectedOptions === "couples"}
                                onSelect={() => setSelectedOptions("couples")}
                            />
                            <OptionComponent
                                name="For families"
                                iconSrc="/homepage/families.png"
                                isSelected={selectedOptions === "families"}
                                onSelect={() => setSelectedOptions("families")}
                            />
                        </div>
                        <GradientButton
                            className="text-xl md:text-3xl"
                            onClick={scrollNext}
                        >
                            Next
                        </GradientButton>
                    </div>
                </CarouselItem>
                <CarouselItem className="pb-2">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-1">
                        <h2 className="text-center font-playfairDSC text-3xl capitalize text-[#205041] md:text-4xl">
                            What language would you prefer?
                        </h2>
                        <div className="flex w-full max-w-[500px] flex-col items-center gap-4 px-2">
                            <LanguageSelector
                                language="Bulgarian"
                                imageSrc="/logic/bg.png"
                            />
                            <LanguageSelector
                                language="English"
                                imageSrc="/logic/en.png"
                            />
                        </div>
                        <GradientButton
                            className="text-xl md:text-3xl"
                            onClick={scrollNext}
                        >
                            Next
                        </GradientButton>
                    </div>
                </CarouselItem>
                {/* <CarouselItem className="pb-2"> 
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-4">
                        <h2 className="font-playfairDSC text-2xl md:text-4xl text-center capitalize text-[#205041]">
                            Why are you looking for help today?
                        </h2>
                        <p className="bg-gradient-to-b from-[#6DD864] to-[#23A53D] bg-clip-text text-transparent">
                            If needed choose multiple
                        </p>
                        <div className="w-full max-w-[500px] space-y-2 md:space-y-4">
                            {[1, 2, 3, 4, 5, 6].map((_, index) => (
                                <HelpSelector
                                    key={index}
                                    option={`Lorem ipsum dolor sit amet ${index}`}
                                />
                            ))}
                        </div>
                        <GradientButton
                            className="text-xl md:text-3xl"
                             onClick={scrollNext}
                        >
                            Next
                        </GradientButton>
                    </div>
                </CarouselItem> */}
                <CarouselItem className="pb-2">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4  px-4">
                        <h2 className="text-center font-playfairDSC text-2xl capitalize text-[#205041] md:text-4xl">
                            How much does it concern you?
                        </h2>
                        <p className="bg-gradient-to-b from-[#6DD864] to-[#23A53D] bg-clip-text text-transparent">
                            Drag from left to right
                        </p>
                        <div className="w-full max-w-[500px] space-y-4">
                            <div className="flex h-[40px] rounded-full border-2 border-white">
                                <div
                                    className="flex w-1/3 items-center justify-center rounded-l-full bg-[#08BF6B] text-white"
                                    onClick={() => {
                                        setDraggedValue(0);
                                    }}
                                >
                                    A little
                                </div>
                                <div
                                    className={cn(
                                        "flex w-1/3 items-center justify-center text-[#FCD96A]  transition-colors duration-300",
                                        draggedValue >= 50 &&
                                            "bg-[#FCD96A] text-white",
                                    )}
                                    onClick={() => {
                                        setDraggedValue(50);
                                    }}
                                >
                                    Moderate
                                </div>
                                <div
                                    className={cn(
                                        "flex w-1/3 items-center justify-center rounded-r-full text-[#FC8A6A]  transition-colors duration-300",
                                        draggedValue >= 100 &&
                                            "bg-[#FC8A6A] text-white",
                                    )}
                                    onClick={() => {
                                        setDraggedValue(100);
                                    }}
                                >
                                    Quite much
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
                        <GradientButton
                            className="text-xl md:text-3xl"
                            onClick={fetchItems}
                        >
                            Finnish up
                        </GradientButton>
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
};
const Loader = () => (
    <div className="fixed top-0 flex h-screen w-full flex-col items-center justify-center gap-5">
        <SearchCheck className="animate-bounce text-[#205041]" size={90} />
        <h2 className="font-playfairDSC text-5xl text-[#205041]">
            Selection is loading
        </h2>
        <p className="text-xl text-[#128665]">
            We are looking for people tailored to your needs
        </p>
    </div>
);
const Page: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [finnishedOptions, setFinnishedOptions] = useState(false);
    const [isShown, setIsShown] = useState(false);
    const [psychologists, setPsychologists] = useState<PsychologistProfile[]>(
        [],
    );
    const {user}=useAuth();
    const router=useRouter();
    useEffect(() => {
        if (!user.uid) {
            router.push("/login");
        }
    }, [user, router]);
    function fetchItems() {
        setFinnishedOptions(true);
        setIsLoading(true);

        const q = query(
            collection(db, "psychologists"),
            where("approved", "==", true),
        );
        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const tempValues: PsychologistProfile[] = [];
                querySnapshot.forEach((doc) => {
                    tempValues.push(doc.data() as PsychologistProfile);
                });
                setPsychologists(tempValues);
                setIsLoading(false);
            },
            (error) => {
                console.error("Error fetching items: ", error);
                setIsLoading(false);
            },
        );

        return unsubscribe;
    }

    return (
        <main className="bg-[#F7F4E0] flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden font-openSans ">
            {!finnishedOptions && <OptionsSection fetchItems={fetchItems} />}
            {isLoading && <Loader />}
            {psychologists.length !== 0 ? (
                <>
                    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-7 px-6 pb-2 md:gap-14">
                        <div className="mt-20 flex flex-col items-center justify-center gap-4">
                            <h3 className="text-center font-playfairDSC text-3xl uppercase text-[#128665]">
                                Our top 3 psychologists
                            </h3>
                            <p className="text-xl text-[#205041]">
                                Picked specifically for you
                            </p>
                        </div>
                        <div className="flex w-full flex-wrap items-center justify-center gap-10 md:w-2/3">
                            {psychologists.length > 0 ? (
                                ["Deluxe", "Premium", "Basic"].map(
                                    (variant) => {
                                        const filteredPsychologists =
                                            psychologists.filter(
                                                (p) => p.variant === variant,
                                            );
                                        if (filteredPsychologists.length > 0) {
                                            return filteredPsychologists
                                                .slice(0, 3)
                                                .map((psychologist, index) => (
                                                    <ProfileCard
                                                        {...psychologist}
                                                        key={`${variant}-${index}`}
                                                    />
                                                ));
                                        }
                                        return null;
                                    },
                                )
                            ) : (
                                <p>
                                    There are no available psychologists at the
                                    moment :(
                                </p>
                            )}
                        </div>
                        {!isShown && (
                            <GradientButton
                                onClick={() => {
                                    setIsShown(true);
                                }}
                            >
                                Show all psychologists (
                                {psychologists.length -
                                    psychologists
                                        .filter((p) => p.variant === "Deluxe")
                                        .slice(0, 3).length}
                                )
                            </GradientButton>
                        )}
                    </section>
                    {isShown && (
                        <section className=" flex h-fit w-full flex-col items-center justify-center  gap-6 bg-gradient-to-b from-[#40916C] to-[#52B788] px-4 py-20">
                            <h2 className="font-playfairDSC text-4xl text-white drop-shadow-xl [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
                                Selection of choices solely for you
                            </h2>
                            <div className="flex  w-full flex-wrap items-center justify-center gap-10 md:w-2/3">
                                {psychologists
                                    .filter((p) => p.variant === "Deluxe")
                                    .map((pyshologist, index) => (
                                        <ProfileCard
                                            {...pyshologist}
                                            key={index}
                                        />
                                    ))}
                                {psychologists
                                    .filter((p) => p.variant === "Premium")
                                    .map((pyshologist, index) => (
                                        <ProfileCard
                                            {...pyshologist}
                                            key={index}
                                        />
                                    ))}
                                {psychologists
                                    .filter((p) => p.variant === "Basic")
                                    .map((pyshologist, index) => (
                                        <ProfileCard
                                            {...pyshologist}
                                            key={index}
                                        />
                                    ))}
                            </div>
                        </section>
                    )}
                </>
            ) : (
                finnishedOptions &&
                !isLoading && (
                    <div className="flex flex-col items-center justify-center gap-2 p-2">
                        {" "}
                        <Image
                            src={"/logic/notfound.svg"}
                            alt="Search failed"
                            width={500}
                            height={500}
                        />
                        <p className="text-center text-3xl text-[#205041]">
                            Oops! We couldn&apos;t find a match for you at the
                            moment!
                        </p>
                    </div>
                )
            )}
        </main>
    );
};

export default Page;
