"use client";
import MainButton from "@/components/MainButton";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { HeaderT } from "@/models/header";
import AutoScroll from "embla-carousel-auto-scroll";
import {
    BriefcaseIcon,
    Building2Icon,
    ChevronRight,
    InfoIcon,
    TelescopeIcon,
    UsersRoundIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const carouselItems = [
    {
        image: "/homepage/avatar.png",
        profession: "Psychologist",
        quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
        name: "Test Testov",
        experience: "10+ year of practical experience",
    },
    {
        image: "/homepage/avatar.png",
        profession: "Psychologist",
        quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
        name: "Test Testov",
        experience: "10+ year of practical experience",
    },
    {
        image: "/homepage/avatar.png",
        profession: "Psychologist",
        quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
        name: "Test Testov",
        experience: "10+ year of practical experience",
    },
    {
        image: "/homepage/avatar.png",
        profession: "Psychologist",
        quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
        name: "Test Testov",
        experience: "10+ year of practical experience",
    },
    {
        image: "/homepage/avatar.png",
        profession: "Psychologist",
        quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
        name: "Test Testov",
        experience: "10+ year of practical experience",
    },
];
const BottomLine = () => (
    <hr className="w-full rounded-full border-2 border-[#FCFBF4] drop-shadow-lg" />
);
function HeroSection() {
    const t = useTranslations("HomePage");
    function HeaderCard({ title, image }: HeaderT) {
        return (
            <Link
                href={"/search"}
                className="flex  cursor-pointer flex-col items-center justify-between gap-2 rounded-3xl bg-[#B2D3A8] p-3 transition-transform hover:scale-105"
            >
                <Image src={image} alt={title} width={250} height={250} />
                <div className="flex w-full items-center justify-between">
                    <h4 className="text-lg">{title}</h4>
                    <ChevronRight />
                </div>
            </Link>
        );
    }
    return (
        <section className="flex min-h-screen w-full flex-col items-center justify-center gap-7 bg-gradient-to-b from-[#40916C] to-[#52B788] pt-16 text-white md:pt-10">
            <div className="flex w-2/3 flex-col items-center gap-7 text-center">
                <h1 className="font-playfairDSC text-3xl font-thin capitalize md:text-5xl">
                    {t("title")}
                </h1>
                <h3 className="font-openSans text-xl md:text-2xl">
                    {t("titleDescription")}
                </h3>
                <Link href={"login"}>
                    <MainButton className="text-3xl">
                        {t("button.getStarted")}
                    </MainButton>
                </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 p-2 md:gap-10">
                <HeaderCard
                    title={t("services.you")}
                    image="/homepage/person.png"
                />
                <HeaderCard
                    title={t("services.couples")}
                    image="/homepage/couples.png"
                />
                <HeaderCard
                    title={t("services.family")}
                    image="/homepage/families.png"
                />
            </div>
        </section>
    );
}
function MissionSection() {
    const t = useTranslations("HomePage");
    const missionItems = [
        {
            title: t("mission.missionTitle"),
            description: t("mission.missionDescription"),
            icon: <InfoIcon />,
        },
        {
            title: t("mission.creatorsTitle"),
            description: t("mission.creatorsDescription"),
            icon: <Building2Icon />,
        },
        {
            title: t("mission.usersTitle"),
            description: t("mission.usersDescription"),
            icons: <UsersRoundIcon />,
        },
        {
            title: t("mission.psychologistsTitle"),
            description: t("mission.psychologistsDescription"),
            icon: <BriefcaseIcon />,
        },
        {
            title: t("mission.visionTitle"),
            description: t("mission.visionDescription"),
            icon: <TelescopeIcon />,
        },
    ];
    return (
        <section className="flex h-fit w-full flex-col items-center justify-center gap-4 px-4 py-10 md:gap-10">
            <h2 className="text bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text font-playfairDSC text-4xl text-transparent md:text-5xl">
                {t("mission.sectionTitle")}
            </h2>
            <Carousel
                className="w-full drop-shadow-2xl"
                plugins={[
                    AutoScroll({
                        playOnInit: true,
                        speed: 2,
                    }),
                ]}
                opts={{
                    loop: true,
                    align: "start",
                }}
            >
                <CarouselContent className="lg:-ml-1">
                    {missionItems.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className="pl-4 sm:basis-1/2 lg:basis-1/3"
                        >
                            <div className="flex h-full w-full flex-col justify-between gap-4 rounded-2xl border-4 border-[#25BA9E] bg-[#F1ECCC] px-4 py-2 ">
                                <div className="flex w-full justify-between gap-2">
                                    <h2 className=" text-xl font-bold text-[#205041] sm:text-3xl">
                                        {item.title}
                                    </h2>
                                    <div className="flex h-10 min-w-10 items-center justify-center rounded-full border-2 border-[#25BA9E] bg-white text-xl text-[#25BA9E]">
                                        {item.icon}
                                    </div>
                                </div>
                                <div className="flex h-fit flex-col gap-2 rounded-xl border-[#205041] bg-white px-2 py-1">
                                    <p className="line-clamp-5 h-full items-center justify-center text-lg text-[#205041]">
                                        {item.description}
                                    </p>
                                    <Link href={"/mission"}>
                                        <MainButton className="w-fit border-2 border-[#25BA9E] hover:scale-105">
                                            {t("mission.readMore")}
                                        </MainButton>
                                    </Link>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
}
function TherapistsSection() {
    return (
        <section className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-4 md:gap-10 md:px-[100px] lg:px-[150px] xl:px-[200px]">
            <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
                <p className="text-center font-playfairDSC  text-2xl text-[#205041]">
                    Handpicked Psychologists,
                    <br />
                    <span className="text-[#128665]">Based on Your Needs</span>
                </p>
                <Link href={"/login"}>
                    <MainButton className="text-xl">
                        Get Started
                    </MainButton>
                </Link>
            </div>
            <Carousel
                className="w-screen md:max-w-[70vw]"
                opts={{ loop: true }}
            >
                <CarouselContent className="px-4 md:-ml-4">
                    {carouselItems.map((item, index) => (
                        <CarouselItem
                            key={index}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <Card className="rounded-2xl">
                                <CardHeader className="flex items-center">
                                    <Avatar className="size-32">
                                        <AvatarImage src={item.image} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <Badge
                                        variant="outline"
                                        className="text-md bg-[#128665] bg-opacity-75 px-3 py-1 font-thin text-white"
                                    >
                                        {item.profession}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="text-center font-playfairDSC text-xl text-[#205041]">
                                    <p>{item.quote}</p>
                                </CardContent>
                                <CardFooter className="flex flex-col items-center font-openSans">
                                    <p className="text-[#205041]">
                                        {item.name}
                                    </p>
                                    <p className="text-sm text-[#128665]">
                                        {item.experience}
                                    </p>
                                </CardFooter>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
            <BottomLine />
        </section>
    );
}
function ReviewsSection() {
    return (
        <section className="w-full space-y-5">
            <div className="flex items-center justify-center gap-2">
                {Array.from({ length: 5 }).map((_, index) => (
                    <img
                        src="/homepage/star.png"
                        alt="star"
                        key={index}
                        width={32}
                    />
                ))}
            </div>
            <h2 className="bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text px-2 text-center font-playfairDSC text-3xl capitalize text-transparent md:text-4xl">
                More than 10000 5-star reviews
            </h2>
            <Carousel
                plugins={[
                    AutoScroll({
                        playOnInit: true,
                        stopOnMouseEnter: true,
                        speed: 3,
                    }),
                ]}
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent className="-ml-2 md:-ml-4">
                    {Array.from({ length: 16 }).map((item, index) => (
                        <CarouselItem
                            key={index}
                            className="basis-1/2 md:basis-1/3 lg:basis-1/5"
                        >
                            <div
                                className={cn(
                                    "flex h-fit w-full gap-4",
                                    index % 2 === 0
                                        ? "flex-col"
                                        : "flex-col-reverse",
                                )}
                            >
                                <p
                                    className={cn(
                                        "w-full rounded-2xl bg-[#18866580] p-4 text-center",
                                        index % 2 === 0 && "bg-[#18208680]",
                                        index % 3 === 0 && "bg-[#867A1880]",
                                        index % 4 === 0 && "bg-[#86183B80]",
                                    )}
                                >
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit.
                                </p>
                                <div className="relative h-fit">
                                    <p className="absolute p-2 text-xl text-white">
                                        Alex
                                    </p>
                                    <img
                                        src="/homepage/reviews.png"
                                        alt="reviews"
                                    />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="md:px-[100px] lg:px-[150px] xl:px-[200px]">
                <BottomLine />
            </div>
        </section>
    );
}
function ApproachSection() {
    const t = useTranslations("HomePage");
    const [activeElement, setActiveElement] = useState("first");
    return (
        <section className="w-full space-y-5 px-2 py-5 md:px-[100px] lg:px-[150px] xl:px-[200px]">
            <h3 className="bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-center font-playfairDSC text-4xl capitalize text-transparent">
                {t("approach.approachTitle")}
            </h3>
            <div className="flex w-full items-center justify-around">
                <div className="w-full space-y-5 md:w-1/3">
                    <div
                        className={cn(
                            "flex w-full items-center justify-start gap-3 rounded-3xl p-2 font-openSans drop-shadow-md transition-all md:p-3 hover:md:scale-110",
                            activeElement === "first" && "bg-white",
                        )}
                        onMouseEnter={() => {
                            setActiveElement("first");
                        }}
                    >
                        <p className="flex size-10 items-center justify-center rounded-full bg-[#FC8A6A] font-thin text-white">
                            1
                        </p>
                        <p className="text-xl text-[#205041]">
                            {t("approach.stepOneTitle")}
                        </p>
                    </div>
                    <div
                        className={cn(
                            "flex w-full items-center justify-start gap-2 rounded-3xl p-2 font-openSans drop-shadow-md transition-all md:p-3 hover:md:scale-110",
                            activeElement === "second" && "bg-white",
                        )}
                        onMouseEnter={() => {
                            setActiveElement("second");
                        }}
                    >
                        <p className="flex size-10 items-center justify-center rounded-full bg-[#FCD96A] font-thin text-white">
                            2
                        </p>
                        <p className="text-lg text-[#205041] md:text-xl">
                            {t("approach.stepTwoTitle")}
                        </p>
                    </div>
                    <div
                        className={cn(
                            "flex w-full items-center justify-start gap-3 rounded-3xl p-2 font-openSans drop-shadow-md transition-all md:p-3 hover:md:scale-110",
                            activeElement === "third" && "bg-white",
                        )}
                        onMouseEnter={() => {
                            setActiveElement("third");
                        }}
                    >
                        <p className="flex size-10 items-center justify-center rounded-full bg-[#08BF6B] font-thin text-white">
                            3
                        </p>
                        <p className="text-xl text-[#205041]">
                            {t("approach.stepThreeTitle")}
                        </p>
                    </div>
                </div>
                <img
                    src="/homepage/approach.png"
                    alt={t("approach.approachImageAlt")}
                    className="hidden max-h-[400px] md:block"
                />
            </div>
            <div className="flex w-full justify-center px-4">
                <Link href={"/login"}>
                    <MainButton className="text-2xl">
                        {t("button.startNow")}
                    </MainButton>
                </Link>
            </div>
            <BottomLine />
        </section>
    );
}
function FaQSection() {
    const t = useTranslations("HomePage");
    return (
        <section className="mb-5 flex w-full flex-col items-center justify-center gap-4 px-4 md:px-[100px] lg:px-[150px] xl:px-[200px]">
            <h3 className="text-center font-playfairDSC text-4xl text-[#205041]">
                {t("faq.faqTitle")}
            </h3>
            <div className="w-full rounded-2xl bg-white p-2 font-openSans text-xl">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-left">
                            {t("faq.faqQuestion1")}
                        </AccordionTrigger>
                        <AccordionContent>
                            {t("faq.faqAnswer1")}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left">
                            {t("faq.faqQuestion2")}
                        </AccordionTrigger>
                        <AccordionContent>
                            {t("faq.faqAnswer2")}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left">
                            {t("faq.faqQuestion3")}
                        </AccordionTrigger>
                        <AccordionContent>
                            {t("faq.faqAnswer3")}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Link href={"/login"}>
                    <MainButton className="text-2xl">
                        {t("button.beginNow")}
                    </MainButton>
                </Link>
            </div>
            <BottomLine />
        </section>
    );
}
function JoinSection() {
    const t = useTranslations("HomePage");
    const [calcPrice, setCalcPrice] = useState(10400);
    return (
        <section className="flex w-full items-center justify-between px-4 py-5 md:px-[100px] lg:px-[150px] xl:px-[200px]">
            <img
                src="/homepage/join.png"
                alt={t("join.joinImageAlt")}
                className="hidden md:block md:max-h-[300px] lg:max-h-[400px] xl:max-h-[500px]"
            />
            <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
                <h2 className="font-playfairDSC text-3xl font-thin text-[#205041] md:text-4xl">
                    {t("join.joinTitle")}
                </h2>
                <h4 className="text-2xl">{t("join.joinSubtitle")}</h4>
                <div className="w-full rounded-2xl bg-[#188665BF] p-4 text-center font-openSans md:w-2/3">
                    <h3 className="text-2xl text-[#FCFBF4]">
                        {t("join.earningsIntro")}
                    </h3>
                    <div className="flex w-full flex-col items-center justify-between text-[#F1ECCC] sm:flex-row ">
                        <div className="flex w-1/2 flex-col items-center">
                            <Select
                                onValueChange={(value) => {
                                    setCalcPrice(parseInt(value) * 520);
                                }}
                            >
                                <SelectTrigger className="rounded-full text-xl text-[#205041] md:max-w-[100px]">
                                    <SelectValue placeholder="20" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 168 }).map(
                                        (_, index) => (
                                            <SelectItem
                                                key={index}
                                                value={`${index + 1}`}
                                            >
                                                {index + 1}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectContent>
                            </Select>
                            <p>{t("join.weeklyHoursLabel")}</p>
                        </div>
                        <p className="text-3xl">=</p>
                        <div className="w-1/2">
                            <h5 className="font-playfairDSC text-3xl">
                                ${calcPrice}
                            </h5>
                            <p>{t("join.estimatedEarningsLabel")}</p>
                        </div>
                    </div>
                </div>
                <Link href={"/login"}>
                    <MainButton className="text-xl sm:text-3xl">
                        {t("button.applyNow")}
                    </MainButton>
                </Link>
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-[#F7F4E0] from-85% to-[#E5CA8B]">
            <HeroSection />
            <MissionSection />
            {/* <TherapistsSection />
            <ReviewsSection /> */}
            <ApproachSection />
            <FaQSection />
            <JoinSection />
        </main>
    );
}
