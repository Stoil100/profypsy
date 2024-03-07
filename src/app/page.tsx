"use client";
import GradientButton from "@/components/GradientButton";
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
import { cn } from "@/lib/utils";
import { HeaderT, HeadersT } from "@/models/header";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const headers: HeadersT = [
    {
        image: "/person.png",
        title: "For you",
    },
    {
        image: "/couples.png",
        title: "For couples",
    },
    {
        image: "/families.png",
        title: "For families",
    },
];
const carouselItems = [
    {
        image: "/avatar.png",
        profession: "Psychologist",
        quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
        name: "Test Testov",
        experience: "10+ year of practical experience",
    },
    {
        image: "/avatar.png",
        profession: "Psychologist",
        quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
        name: "Test Testov",
        experience: "10+ year of practical experience",
    },
    {
        image: "/avatar.png",
        profession: "Psychologist",
        quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
        name: "Test Testov",
        experience: "10+ year of practical experience",
    },
    {
        image: "/avatar.png",
        profession: "Psychologist",
        quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
        name: "Test Testov",
        experience: "10+ year of practical experience",
    },
    {
        image: "/avatar.png",
        profession: "Psychologist",
        quote: "“Lorem ipsum dolor sit amet consectetur. Laoreet pretium amet ipsum faucibus ultricies porttitor nibh.”",
        name: "Test Testov",
        experience: "10+ year of practical experience",
    },
];
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
        <section className="flex min-h-screen w-full flex-col items-center justify-center gap-7 bg-gradient-to-b from-[#40916C] to-[#52B788] pt-20 text-white">
            <div className="flex w-2/3 flex-col items-center gap-7 text-center">
                <h1 className="font-playfairDSC text-5xl font-thin capitalize">
                    Your Journey to <br /> Mental Wellness Begins Here
                </h1>
                <h3 className="font-openSans text-2xl">
                    Choose your therapist and begin
                    <br /> your session now
                </h3>
                <GradientButton className="text-3xl">
                    Get Started
                </GradientButton>
            </div>
            <div className="flex items-center justify-center gap-10">
                <HeaderCard title="For you" image="/person.png" />
                <HeaderCard title="For couples" image="/couples.png" />
                <HeaderCard title="For families" image="/families.png" />
            </div>
        </section>
    );
}
function TherapistsSection() {
    return (
        <section className="flex min-h-screen flex-col items-center justify-center gap-10">
            <div className="flex w-full items-center justify-between">
                <p className="font-playfairDSC text-2xl text-[#205041]">
                    Handpicked Psychologists,
                    <br />
                    <span className="text-[#128665]">Based on Your Needs</span>
                </p>
                <GradientButton className="text-xl">Get Started</GradientButton>
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
                                <CardContent className="font-playfairDSC text-center text-xl text-[#205041]">
                                    <p>{item.quote}</p>
                                </CardContent>
                                <CardFooter className="font-openSans flex flex-col items-center">
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
            <hr className="w-full rounded-full border-2 border-[#FCFBF4] drop-shadow-lg" />
        </section>
    );
}
function ApproachSection() {
    const [activeElement, setActiveElement] = useState("first");
    return (
        <section className="py-5 w-full space-y-5 px-[200px]">
            <h3 className="font-playfairDSC bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-center text-4xl capitalize text-transparent">
                How Profypsy Works
            </h3>
            <div className="flex w-full items-center justify-around">
                <div className="w-1/3 space-y-5">
                    <div
                        className={cn(
                            "font-openSans flex w-full items-center justify-start gap-3 rounded-3xl p-3 drop-shadow-md transition-all hover:scale-110",
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
                            "font-openSans flex w-full items-center justify-start gap-3 rounded-3xl p-3 drop-shadow-md transition-all hover:scale-110",
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
                            "font-openSans flex w-full items-center justify-start gap-3 rounded-3xl p-3 drop-shadow-md transition-all hover:scale-110",
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
                <img src="/approach.png" alt="how profypsy works" className="h-[400px]"/>
            </div>
            <div className="px-4">
            <GradientButton className="text-2xl">Start Now</GradientButton>
            </div>
            <hr className="w-full rounded-full border-2 border-[#FCFBF4] drop-shadow-lg" />
        </section>
    );
}
export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-[#F7F4E0]">
            <HeroSection />
            <TherapistsSection />
            <ApproachSection />
        </main>
    );
}
