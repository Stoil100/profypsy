"use client";
import heroAnimation from "@/../public/homepage/hero.gif";
import MainButton from "@/components/MainButton";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
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

type SectionProps = {
    t: (arg: string) => string;
    // router?: AppRouterInstance;
};

// const carouselItems = [
//     {
//         image: "/homepage/avatar.png",
//         profession: "Psychologist",
//         quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
//         name: "Test Testov",
//         experience: "10+ year of practical experience",
//     },
//     {
//         image: "/homepage/avatar.png",
//         profession: "Psychologist",
//         quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
//         name: "Test Testov",
//         experience: "10+ year of practical experience",
//     },
//     {
//         image: "/homepage/avatar.png",
//         profession: "Psychologist",
//         quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
//         name: "Test Testov",
//         experience: "10+ year of practical experience",
//     },
//     {
//         image: "/homepage/avatar.png",
//         profession: "Psychologist",
//         quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
//         name: "Test Testov",
//         experience: "10+ year of practical experience",
//     },
//     {
//         image: "/homepage/avatar.png",
//         profession: "Psychologist",
//         quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
//         name: "Test Testov",
//         experience: "10+ year of practical experience",
//     },
// ];
const BottomLine = () => (
    <hr className="w-full rounded-full border-2 border-[#FEFFEC] drop-shadow-lg" />
);
const HeroSection: React.FC<SectionProps> = ({ t }) => {
    return (
        <section className="flex  w-full flex-col items-center justify-end gap-7 bg-gradient-to-b from-[#40916C] to-[#52B788] px-2 pt-10 text-white sm:min-h-screen md:flex-row md:px-0 md:pl-20 md:pt-0">
            <div className="flex w-full flex-col items-center space-y-4 text-center md:w-2/5 md:items-start md:text-left">
                <h1 className="font-playfairDSC text-3xl font-thin capitalize [text-shadow:_0_2px_0_rgb(0_0_0_/_40%)] md:text-5xl">
                    {t("title")}
                </h1>
                <h3 className="font-openSans text-xl md:text-2xl">
                    {t("titleDescription")}
                </h3>
                <Link href={"login"} className="block">
                    <MainButton className="text-3xl">
                        {t("getStarted")}
                    </MainButton>
                </Link>
            </div>
            <div className="justify-right flex h-fit w-full items-center  bg-[url('/homepage/bubblesMobile.svg')] bg-contain bg-bottom bg-no-repeat p-5 md:min-h-screen md:w-3/5 md:bg-[url('/homepage/bubbles.svg')] md:bg-right-top md:pr-10">
                <Image
                    src={heroAnimation}
                    alt="Hero Animation"
                    className="w-full drop-shadow-xl"
                />
            </div>
        </section>
    );
};
const MissionSection: React.FC<SectionProps> = ({ t }) => {
    const missionItems = [
        {
            title: t("missionTitle"),
            description: t("missionDescription"),
            icon: <InfoIcon size={40} />,
        },
        {
            title: t("creatorsTitle"),
            description: t("creatorsDescription"),
            icon: <Building2Icon size={40} />,
        },
        {
            title: t("usersTitle"),
            description: t("usersDescription"),
            icons: <UsersRoundIcon size={40} />,
        },
        {
            title: t("psychologistsTitle"),
            description: t("psychologistsDescription"),
            icon: <BriefcaseIcon size={40} />,
        },
        {
            title: t("visionTitle"),
            description: t("visionDescription"),
            icon: <TelescopeIcon size={40} />,
        },
    ];
    return (
        <section className="flex h-fit w-full flex-col items-center justify-center gap-4 px-4 py-10 md:gap-10">
            <h2 className="text bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text font-playfairDSC text-4xl text-transparent md:text-5xl">
                {t("sectionTitle")}
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
                            <div className="flex h-full w-full flex-col justify-between gap-3  bg-[#FEFFEC]  p-4 md:p-8 ">
                                <div className="flex aspect-square w-20 items-center justify-center rounded-full border-4 border-[#25BA9E] text-xl text-[#25BA9E]">
                                    {item.icon}
                                </div>
                                <h2 className=" text-xl font-bold text-[#205041] sm:text-3xl">
                                    {item.title}
                                </h2>
                                <div className="flex h-fit flex-col  px-2 ">
                                    <p className="line-clamp-5 h-full items-center justify-center text-[#205041]">
                                        {item.description}
                                    </p>
                                </div>
                                <Link
                                    href={"/mission"}
                                    className="group relative flex items-center font-bold text-[#25BA9E]"
                                >
                                    {t("readMore")}
                                    <span className="ml-1 inline-block text-xl transition-transform duration-300 ease-in-out group-hover:translate-x-1">
                                        <ChevronRight />
                                    </span>
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </section>
    );
};
// function TherapistsSection() {
//     return (
//         <section className="flex min-h-screen w-full flex-col items-center justify-center gap-4 px-4 md:gap-10 md:px-[100px] lg:px-[150px] xl:px-[200px]">
//             <div className="flex w-full flex-col items-center justify-between gap-2 md:flex-row">
//                 <p className="text-center font-playfairDSC  text-2xl text-[#205041]">
//                     Handpicked Psychologists,
//                     <br />
//                     <span className="text-[#128665]">Based on Your Needs</span>
//                 </p>
//                 <Link href={"/login"}>
//                     <MainButton className="text-xl">Get Started</MainButton>
//                 </Link>
//             </div>
//             <Carousel
//                 className="w-screen md:max-w-[70vw]"
//                 opts={{ loop: true }}
//             >
//                 <CarouselContent className="px-4 md:-ml-4">
//                     {carouselItems.map((item, index) => (
//                         <CarouselItem
//                             key={index}
//                             className="md:basis-1/2 lg:basis-1/3"
//                         >
//                             <Card className="rounded-2xl">
//                                 <CardHeader className="flex items-center">
//                                     <Avatar className="size-32">
//                                         <AvatarImage src={item.image} />
//                                         <AvatarFallback>CN</AvatarFallback>
//                                     </Avatar>
//                                     <Badge
//                                         variant="outline"
//                                         className="text-md bg-[#128665] bg-opacity-75 px-3 py-1 font-thin text-white"
//                                     >
//                                         {item.profession}
//                                     </Badge>
//                                 </CardHeader>
//                                 <CardContent className="text-center font-playfairDSC text-xl text-[#205041]">
//                                     <p>{item.quote}</p>
//                                 </CardContent>
//                                 <CardFooter className="flex flex-col items-center font-openSans">
//                                     <p className="text-[#205041]">
//                                         {item.name}
//                                     </p>
//                                     <p className="text-sm text-[#128665]">
//                                         {item.experience}
//                                     </p>
//                                 </CardFooter>
//                             </Card>
//                         </CarouselItem>
//                     ))}
//                 </CarouselContent>
//                 <CarouselPrevious className="hidden md:flex" />
//                 <CarouselNext className="hidden md:flex" />
//             </Carousel>
//             <BottomLine />
//         </section>
//     );
// }
// function ReviewsSection() {
//     return (
//         <section className="w-full space-y-5">
//             <div className="flex items-center justify-center gap-2">
//                 {Array.from({ length: 5 }).map((_, index) => (
//                     <img
//                         src="/homepage/star.png"
//                         alt="star"
//                         key={index}
//                         width={32}
//                     />
//                 ))}
//             </div>
//             <h2 className="bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text px-2 text-center font-playfairDSC text-3xl capitalize text-transparent md:text-4xl">
//                 More than 10000 5-star reviews
//             </h2>
//             <Carousel
//                 plugins={[
//                     AutoScroll({
//                         playOnInit: true,
//                         stopOnMouseEnter: true,
//                         speed: 3,
//                     }),
//                 ]}
//                 opts={{
//                     loop: true,
//                 }}
//             >
//                 <CarouselContent className="-ml-2 md:-ml-4">
//                     {Array.from({ length: 16 }).map((item, index) => (
//                         <CarouselItem
//                             key={index}
//                             className="basis-1/2 md:basis-1/3 lg:basis-1/5"
//                         >
//                             <div
//                                 className={cn(
//                                     "flex h-fit w-full gap-4",
//                                     index % 2 === 0
//                                         ? "flex-col"
//                                         : "flex-col-reverse",
//                                 )}
//                             >
//                                 <p
//                                     className={cn(
//                                         "w-full rounded-2xl bg-[#18866580] p-4 text-center",
//                                         index % 2 === 0 && "bg-[#18208680]",
//                                         index % 3 === 0 && "bg-[#867A1880]",
//                                         index % 4 === 0 && "bg-[#86183B80]",
//                                     )}
//                                 >
//                                     Lorem ipsum dolor sit amet consectetur
//                                     adipisicing elit.
//                                 </p>
//                                 <div className="relative h-fit">
//                                     <p className="absolute p-2 text-xl text-white">
//                                         Alex
//                                     </p>
//                                     <img
//                                         src="/homepage/reviews.png"
//                                         alt="reviews"
//                                     />
//                                 </div>
//                             </div>
//                         </CarouselItem>
//                     ))}
//                 </CarouselContent>
//             </Carousel>
//             <div className="md:px-[100px] lg:px-[150px] xl:px-[200px]">
//                 <BottomLine />
//             </div>
//         </section>
//     );
// }
const ApproachSection: React.FC<SectionProps> = ({ t }) => {
    const [activeElement, setActiveElement] = useState("first");
    return (
        <section className="w-full space-y-5 px-2 py-5 md:px-[100px] lg:px-[150px] xl:px-[200px]">
            <h3 className="bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-center font-playfairDSC text-4xl capitalize text-transparent md:text-5xl">
                {t("title")}
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
                        <p className="text-xl text-[#205041]">{t("stepOne")}</p>
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
                            {t("stepTwo")}
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
                            {t("stepThree")}
                        </p>
                    </div>
                </div>
                <img
                    src="/homepage/approach.png"
                    alt={t("imageAlt")}
                    className="hidden max-h-[400px] md:block"
                />
            </div>
            <div className="flex w-full justify-center px-4">
                <Link href={"/login"}>
                    <MainButton className="text-2xl">
                        {t("startNow")}
                    </MainButton>
                </Link>
            </div>
            <BottomLine />
        </section>
    );
};
const FaQSection: React.FC<SectionProps> = ({ t }) => {
    return (
        <section className="mb-5 flex w-full flex-col items-center justify-center gap-4 px-4 md:px-[100px] lg:px-[150px] xl:px-[200px]">
            <h3 className="text-center font-playfairDSC text-4xl text-[#205041]">
                {t("title")}
            </h3>
            <div className="w-full rounded-2xl bg-[#FEFFEC] p-2 font-openSans text-xl">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-left">
                            {t("question1")}
                        </AccordionTrigger>
                        <AccordionContent>{t("answer1")}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left">
                            {t("question2")}
                        </AccordionTrigger>
                        <AccordionContent>{t("answer2")}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left">
                            {t("question3")}
                        </AccordionTrigger>
                        <AccordionContent>{t("answer3")}</AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Link href={"/login"}>
                    <MainButton className="text-2xl">
                        {t("beginNow")}
                    </MainButton>
                </Link>
            </div>
            <BottomLine />
        </section>
    );
};
const JoinSection: React.FC<SectionProps> = ({ t }) => {
    const [calcPrice, setCalcPrice] = useState(10400);
    return (
        <section className="flex w-full items-center justify-between px-4 py-5 md:px-[100px] lg:px-[150px] xl:px-[200px]">
            <img
                src="/homepage/join.png"
                alt={t("imageAlt")}
                className="hidden drop-shadow-md md:block md:max-h-[300px] lg:max-h-[400px] xl:max-h-[500px]"
            />
            <div className="flex flex-col items-center gap-4 text-center md:items-end md:text-right">
                <h2 className="font-playfairDSC text-3xl font-thin text-[#205041] md:text-4xl">
                    {t("title")}
                </h2>
                <h4 className="text-2xl">{t("subtitle")}</h4>
                <div className="w-full rounded-2xl bg-[#188665BF] p-4 text-center font-openSans md:w-2/3">
                    <h3 className="text-2xl text-[#FCFBF4]">
                        {t("earningsIntro")}
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
                            <p>{t("weeklyHours")}</p>
                        </div>
                        <p className="text-3xl">=</p>
                        <div className="w-1/2">
                            <h5 className="font-playfairDSC text-3xl">
                                ${calcPrice}
                            </h5>
                            <p>{t("estimatedEarnings")}</p>
                        </div>
                    </div>
                </div>
                <Link href={"/login"}>
                    <MainButton className="text-xl sm:text-3xl">
                        {t("applyNow")}
                    </MainButton>
                </Link>
            </div>
        </section>
    );
};

export default function Home() {
    const t = useTranslations("Pages.Home.sections");
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-[#fbf9f0] from-70% to-[#adebb3]">
            <HeroSection t={(key) => t(`hero.${key}`)} />
            {/* <TherapistsSection />
            <ReviewsSection /> */}
            <ApproachSection t={(key) => t(`approach.${key}`)} />
            <MissionSection t={(key) => t(`mission.${key}`)} />
            <FaQSection t={(key) => t(`faq.${key}`)} />
            <JoinSection t={(key) => t(`join.${key}`)} />
        </main>
    );
}
