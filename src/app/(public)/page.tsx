"use client";
import GradientButton from "@/components/GradientButton";
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
import { HeaderT, HeadersT } from "@/models/header";
import AutoScroll from "embla-carousel-auto-scroll";
import { ChevronRight } from "lucide-react";
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
    function HeaderCard({ title, image }: HeaderT) {
        return (
            <div className="flex w-full cursor-pointer flex-col items-center justify-between gap-2 rounded-3xl bg-[#B2D3A8] p-3 transition-transform hover:scale-105">
                <Image src={image} alt={title} width={250} height={250} />
                <div className="flex w-full items-center justify-between">
                    <h4 className="text-lg">{title}</h4>
                    <ChevronRight />
                </div>
            </div>
        );
    }
    return (
        <section className="flex min-h-screen w-full flex-col items-center justify-center gap-7 bg-gradient-to-b from-[#40916C] to-[#52B788] pt-10 text-white">
            <div className="flex w-2/3 flex-col items-center gap-7 text-center">
                <h1 className="font-playfairDSC text-5xl font-thin capitalize">
                    Your Journey to <br /> Mental Wellness Begins Here
                </h1>
                <h3 className="font-openSans text-2xl">
                    Choose your therapist and begin
                    <br /> your session now
                </h3>
                <Link href={"/login"}>
                    <GradientButton className="text-3xl">
                        Get Started
                    </GradientButton>
                </Link>
            </div>
            <div className="flex items-center justify-center gap-10">
                <HeaderCard title="For you" image="/homepage/person.png" />
                <HeaderCard title="For couples" image="/homepage/couples.png" />
                <HeaderCard title="For families" image="/homepage/families.png" />
            </div>
        </section>
    );
}
function TherapistsSection() {
    return (
        <section className="flex min-h-screen w-full flex-col items-center justify-center gap-10 px-[200px]">
            <div className="flex w-full items-center justify-between">
                <p className="font-playfairDSC text-2xl text-[#205041]">
                    Handpicked Psychologists,
                    <br />
                    <span className="text-[#128665]">Based on Your Needs</span>
                </p>
                <Link href={"/login"}>
                    <GradientButton className="text-xl">
                        Get Started
                    </GradientButton>
                </Link>
            </div>
            <Carousel className="max-w-[70vw]" opts={{ loop: true }}>
                <CarouselContent className="-ml-2 md:-ml-4">
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
                <CarouselPrevious />
                <CarouselNext />
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
                    <img src="/homepage/star.png" alt="star" key={index} width={32} />
                ))}
            </div>
            <h2 className="bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-center font-playfairDSC text-4xl capitalize text-transparent">
                More than 10000 5-star reviews
            </h2>
            <Carousel
                className=""
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
                            className="md:basis-1/3 lg:basis-1/5 "
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
                                    <img src="/homepage/reviews.png" alt="reviews" />
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="px-[200px]">
                <BottomLine />
            </div>
        </section>
    );
}
function ApproachSection() {
    const [activeElement, setActiveElement] = useState("first");
    return (
        <section className="w-full space-y-5 px-[200px] py-5">
            <h3 className="bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-center font-playfairDSC text-4xl capitalize text-transparent">
                How Profypsy Works
            </h3>
            <div className="flex w-full items-center justify-around">
                <div className="w-1/3 space-y-5">
                    <div
                        className={cn(
                            "flex w-full items-center justify-start gap-3 rounded-3xl p-3 font-openSans drop-shadow-md transition-all hover:scale-110",
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
                            Set Up a free account
                        </p>
                    </div>
                    <div
                        className={cn(
                            "flex w-full items-center justify-start gap-3 rounded-3xl p-3 font-openSans drop-shadow-md transition-all hover:scale-110",
                            activeElement === "second" && "bg-white",
                        )}
                        onMouseEnter={() => {
                            setActiveElement("second");
                        }}
                    >
                        <p className="flex size-10 items-center justify-center rounded-full bg-[#FCD96A] font-thin text-white">
                            2
                        </p>
                        <p className="text-xl text-[#205041]">
                            Get matched with a therapist
                        </p>
                    </div>
                    <div
                        className={cn(
                            "flex w-full items-center justify-start gap-3 rounded-3xl p-3 font-openSans drop-shadow-md transition-all hover:scale-110",
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
                            Begin your therapy
                        </p>
                    </div>
                </div>
                <img
                    src="/homepage/approach.png"
                    alt="how profypsy works"
                    className="h-[400px]"
                />
            </div>
            <div className="px-4">
                <Link href={"/login"}>
                    <GradientButton className="text-2xl">
                        Start Now
                    </GradientButton>
                </Link>
            </div>
            <BottomLine />
        </section>
    );
}
function FaQSection() {
    return (
        <section className="mb-5 flex w-full flex-col items-center justify-center gap-4 px-[200px]">
            <h3 className="font-playfairDSC text-4xl text-[#205041]">
                Frequently Asked Questions
            </h3>
            <div className="w-full rounded-2xl bg-white p-2 font-openSans text-xl">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            Is online therapy effective?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes. It adheres to the WAI-ARIA design pattern.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            What is the difference between therapy and
                            psychiatry?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes. It adheres to the WAI-ARIA design pattern.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            How do I get matched with a professional?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes. It adheres to the WAI-ARIA design pattern.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Link href={"/login"}>
                    <GradientButton className="text-2xl">
                        Begin Now
                    </GradientButton>
                </Link>
            </div>
            <BottomLine />
        </section>
    );
}
function JoinSection() {
    const [calcPrice, setCalcPrice] = useState(10400);
    return (
        <section className="flex w-full items-center justify-between px-[200px] py-5">
            <img
                src="/homepage/join.png"
                alt="join as a psychologist"
                className="h-[500px]"
            />
            <div className="flex flex-col items-end gap-4 text-right">
                <h2 className="font-playfairDSC text-4xl font-thin text-[#205041]">
                    Would You Like To Join As A Psychologist?
                </h2>
                <h4 className="text-2xl">
                    We are now over 2000 specialists, and still searching for
                    more specisalists in the field
                </h4>
                <div className="w-2/3 rounded-2xl bg-[#188665BF] p-4 text-center font-openSans">
                    <h3 className="text-2xl text-[#FCFBF4]">
                        As a Propsy therapist you can earn an estimated
                    </h3>
                    <div className="flex w-full items-center justify-between text-[#F1ECCC] ">
                        <div className="flex w-1/2 flex-col items-center">
                            <Select
                                onValueChange={(value) => {
                                    setCalcPrice(parseInt(value) * 520);
                                }}
                            >
                                <SelectTrigger className="w-[100px] rounded-full text-xl text-[#205041]">
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
                            <p>Weekly hours</p>
                        </div>
                        <p className="text-3xl">=</p>
                        <div className="w-1/2">
                            <h5 className="font-playfairDSC text-3xl">
                                ${calcPrice}
                            </h5>
                            <p>Estimated annual earnings</p>
                        </div>
                    </div>
                </div>
                <Link href={"/login"}>
                    <GradientButton className="text-3xl">
                        Apply Now
                    </GradientButton>
                </Link>
            </div>
        </section>
    );
}
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-[#F7F4E0] from-85% to-[#E5CA8B]">
            <HeroSection />
            <TherapistsSection />
            <ReviewsSection />
            <ApproachSection />
            <FaQSection />
            <JoinSection />
        </main>
    );
}
