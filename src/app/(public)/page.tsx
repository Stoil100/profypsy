"use client";
import GradientButton from "@/components/MainButton";
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
const missionItems =[
    {title:"Our Mission:",description:"Our mission is to provide an accessible, convenient, and effective platform for psychotherapy, which helps people improve their mental well-being and live more fully and happily. We created this platform with the belief that every individual deserves support and care for their mental health, regardless of financial or geographical constraints."},
    {title:"Meaning for the Creators:",description:"For us, the creators of this platform, the meaning lies in the opportunity to make a positive change in people's lives by providing them with an easy and accessible way to receive quality psychotherapeutic assistance. Our goal is to eliminate barriers to access to mental health and to create a society where everyone can take care of themselves and develop their unlimited potential."},
    {title:"Meaning for the Users:",description:"For our client users, the meaning lies in the opportunity to receive personalized and quality psychotherapy that meets their needs and goals. We believe that everyone deserves to feel supported and understood, and that psychotherapy can be a powerful tool for personal development and overcoming life challenges."},
    {title:"Meaning for the Psychologists:",description:" For our psychologist users, the meaning lies in the opportunity to expand their practice and reach more people in need of their assistance. The platform provides them with the opportunity to work at a convenient time and place, allowing them to focus on what they do best - helping others feel better."},
    {title:"Vision and Values:",description:"Our vision is to build a world and future where everyone has access to psychotherapeutic assistance that supports them in their development and growth. We value transparency, trust, and respect for each of our users and strive for continuous improvement and innovation in the field of mental health."}
]
const BottomLine = () => (
    <hr className="w-full rounded-full border-2 border-[#FCFBF4] drop-shadow-lg" />
);
function HeroSection() {
    function HeaderCard({ title, image }: HeaderT) {
        return (
            <Link href={"/search"} className="flex  cursor-pointer flex-col items-center justify-between gap-2 rounded-3xl bg-[#B2D3A8] p-3 transition-transform hover:scale-105">
                <Image src={image} alt={title} width={250} height={250} />
                <div className="flex w-full items-center justify-between">
                    <h4 className="text-lg">{title}</h4>
                    <ChevronRight />
                </div>
            </Link>
        );
    }
    return (
        <section className="flex min-h-screen w-full flex-col items-center justify-center gap-7 bg-gradient-to-b from-[#40916C] to-[#52B788] pt-16 md:pt-10 text-white">
            <div className="flex w-2/3 flex-col items-center gap-7 text-center">
                <h1 className="font-playfairDSC text-3xl md:text-5xl font-thin capitalize">
                    Your Journey to <br /> Mental Wellness Begins Here
                </h1>
                <h3 className="font-openSans text-xl md:text-2xl">
                    Choose your therapist and begin
                    <br /> your session now
                </h3>
                <Link href={"/login"}>
                    <GradientButton className="text-3xl">
                        Get Started
                    </GradientButton>
                </Link>
            </div>
            <div className="flex items-center justify-center gap-4 md:gap-10 flex-wrap p-2">
                <HeaderCard title="For you" image="/homepage/person.png" />
                <HeaderCard title="For couples" image="/homepage/couples.png" />
                <HeaderCard title="For families" image="/homepage/families.png" />
            </div>
        </section>
    );
}
function MissionSection() {
    return (
        <section className="flex h-fit py-10 w-full flex-col items-center justify-center gap-4 md:gap-10 px-4">
            <h2 className="text-4xl md:text-5xl font-playfairDSC text bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-transparent">Our mission</h2>
            <Carousel className="w-full md:max-w-[70vw]" opts={{ loop: true,align:"start"}}>
                <CarouselContent className="lg:-ml-1">
                    {missionItems.map((item, index) => (
                        <CarouselItem className="pl-4 lg:basis-1/2 ">
                            <div className="bg-white rounded-2xl p-4 flex flex-col border-[#25BA9E] border-4 h-full w-full">
                            <div className="flex gap-2 w-full justify-between">
                                <h2 className="mb-3 text-3xl font-bold text-[#205041]">{item.title}</h2>
                                <p className="border-2 text-[#25BA9E] border-[#25BA9E] rounded-full text-xl size-10 flex items-center justify-center">{index + 1}</p>
                            </div>
                            <p className="text-lg px-4 flex justify-center items-center h-full">
                                {item.description}
                            </p>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex"/>
                <CarouselNext className="hidden md:flex"/>
            </Carousel>
        </section>
    )
}
function TherapistsSection() {
    return (
        <section className="flex min-h-screen w-full flex-col items-center justify-center gap-4 md:gap-10 px-4 md:px-[100px] lg:px-[150px] xl:px-[200px]">
            <div className="flex flex-col md:flex-row w-full items-center justify-between gap-2">
                <p className="font-playfairDSC text-center  text-2xl text-[#205041]">
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
            <Carousel className="w-screen md:max-w-[70vw]" opts={{ loop: true }}>
                <CarouselContent className="md:-ml-4 px-4">
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
                <CarouselPrevious className="hidden md:flex"/>
                <CarouselNext className="hidden md:flex"/>
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
            <h2 className="px-2 bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-center font-playfairDSC text-3xl md:text-4xl capitalize text-transparent">
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
                            className="md:basis-1/3 lg:basis-1/5 basis-1/2"
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
                                    <img src="/homepage/reviews.png" alt="reviews"/>
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
    const [activeElement, setActiveElement] = useState("first");
    return (
        <section className="w-full space-y-5 px-2 md:px-[100px] lg:px-[150px] xl:px-[200px] py-5">
            <h3 className="bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-center font-playfairDSC text-4xl capitalize text-transparent">
                How Profypsy Works
            </h3>
            <div className="flex w-full items-center justify-around">
                <div className="w-full md:w-1/3 space-y-5">
                    <div
                        className={cn(
                            "flex w-full items-center justify-start gap-3 rounded-3xl p-2 md:p-3 font-openSans drop-shadow-md transition-all hover:md:scale-110",
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
                            "flex w-full items-center justify-start gap-2  rounded-3xl p-2 md:p-3 font-openSans drop-shadow-md transition-all hover:md:scale-110",
                            activeElement === "second" && "bg-white",
                        )}
                        onMouseEnter={() => {
                            setActiveElement("second");
                        }}
                    >
                        <p className="flex size-10 items-center justify-center rounded-full bg-[#FCD96A] font-thin text-white">
                            2
                        </p>
                        <p className="text-lg md:text-xl text-[#205041]">
                            Get matched with a therapist
                        </p>
                    </div>
                    <div
                        className={cn(
                            "flex w-full items-center justify-start gap-3 rounded-3xl p-2 md:p-3 font-openSans drop-shadow-md transition-all hover:md:scale-110",
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
                    className="max-h-[400px] hidden md:block"
                />
            </div>
            <div className="px-4 w-full flex justify-center">
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
        <section className="mb-5 flex w-full flex-col items-center justify-center gap-4 px-4 md:px-[100px] lg:px-[150px] xl:px-[200px]">
            <h3 className="text-center font-playfairDSC text-4xl text-[#205041]">
                Frequently Asked Questions
            </h3>
            <div className="w-full rounded-2xl bg-white p-2 font-openSans text-xl">
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-left">
                            Is online therapy effective?
                        </AccordionTrigger>
                        <AccordionContent>
                            Yes, online therapy can be effective, especially
                            when utilized by individuals with appropriate
                            training and experience in the field of
                            psychotherapy. This provides access to therapy for
                            people who might otherwise be unable to access it
                            due to various reasons such as geographical
                            location, financial constraints, or mobility issues.
                            It is important to choose a qualified and licensed
                            therapist and ensure appropriate communication and
                            confidentiality.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left">
                            What is the difference between therapy and
                            psychiatry?
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul>
                                <li>
                                    <h2 className="text-xl font-bold">Psychologist:</h2>
                                    <ul className="list-disc px-6 py-2  text-base">
                                        <li>
                                            Psychologists study human behavior
                                            and thoughts.
                                        </li>
                                        <li>
                                            They typically hold a bachelor&apos;s,
                                            master&apos;s, or doctoral degree in
                                            psychology.
                                        </li>
                                        <li>
                                            They can conduct psychological
                                            assessments, consultations, and
                                            provide counseling but cannot
                                            prescribe medication.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <h2 className="text-xl font-bold">Psychotherapist:</h2>
                                    <ul className="list-disc px-6 py-2 text-base">
                                        <li>
                                            Psychotherapists specialize in
                                            treating mental disorders and issues
                                            through various therapeutic methods.
                                        </li>
                                        <li>
                                            They usually have specialized
                                            training or a master&apos;s degree in
                                            psychology, psychiatry, social work,
                                            or a related field.
                                        </li>
                                        <li>
                                            They perform psychotherapy,
                                            including individual sessions, group
                                            therapies, and other techniques.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <h2 className="text-xl font-bold">Psychiatrist:</h2>
                                    <ul className="list-disc px-6 py-2 text-base">
                                        <li>
                                            Psychiatrists are medical doctors
                                            specialized in diagnosing, treating,
                                            and managing mental disorders.
                                        </li>
                                        <li>
                                            They hold a medical degree and are
                                            licensed to prescribe medication.
                                        </li>
                                        <li>
                                            They may conduct therapy sessions,
                                            but their primary role is related to
                                            medication management and treatment
                                            of mental health.
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left">
                            How do I get matched with a professional?
                        </AccordionTrigger>
                        <AccordionContent>
                            <h2 className="text-2xl">
                                Choosing the right therapist is crucial for the
                                success of therapy.
                            </h2>
                            <p className="text-lg">
                                Here are a few steps to help you choose the
                                right therapist for you:
                            </p>

                            <ol className="list-decimal px-6 py-2 text-base">
                                <li>
                                    <strong>
                                        Identify your needs and goals:
                                    </strong>{" "}
                                    Understand what problems or challenges you
                                    want to address through therapy and what
                                    goals you want to achieve.
                                </li>

                                <li>
                                    <strong>
                                        Explore different therapy methods:
                                    </strong>{" "}
                                    There are many different therapy methods,
                                    such as cognitive-behavioral therapy,
                                    psychoanalysis, gestalt therapy, and others.
                                    Choose a method that inspires confidence and
                                    that you believe will be suitable for your
                                    needs.
                                </li>

                                <li>
                                    <strong>
                                        Look for licensed and qualified
                                        professionals:
                                    </strong>{" "}
                                    Make sure that your potential therapist is
                                    licensed and has appropriate educational
                                    background and experience. Check their
                                    qualifications and certificates.
                                </li>

                                <li>
                                    <strong>Ask for recommendations:</strong>{" "}
                                    Ask friends, family, or your doctor for
                                    recommendations for good therapists.
                                    Additionally, browse online reviews and
                                    ratings for potential candidates.
                                </li>

                                <li>
                                    <strong>Try the first session:</strong> Many
                                    therapists offer free initial consultations.
                                    Take advantage of this opportunity to assess
                                    your compatibility with the therapist and to
                                    determine whether their style and methods
                                    meet your needs.
                                </li>

                                <li>
                                    <strong>Establish trust:</strong> It is
                                    important to feel comfortable and confident
                                    in your therapist&apos;s abilities. Trust and
                                    good communication are key to successful
                                    therapy.
                                </li>
                            </ol>

                            <p>
                                By following these steps, it will be easier to
                                choose the right therapist for you, who will
                                help you achieve your goals and improve your
                                mental well-being.
                            </p>
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
        <section className="flex w-full items-center justify-between px-4 md:px-[100px] lg:px-[150px] xl:px-[200px] py-5">
            <img
                src="/homepage/join.png"
                alt="join as a psychologist"
                className="md:block hidden md:max-h-[300px] lg:max-h-[400px] xl:max-h-[500px]"
            />
            <div className="flex flex-col items-center md:items-end gap-4 text-center md:text-right">
                <h2 className="font-playfairDSC text-3xl md:text-4xl font-thin text-[#205041]">
                    Would You Like To Join As A Psychologist?
                </h2>
                <h4 className="text-2xl">
                    We are now over 2000 specialists, and still searching for
                    more specisalists in the field
                </h4>
                <div className="w-full md:w-2/3 rounded-2xl bg-[#188665BF] p-4 text-center font-openSans">
                    <h3 className="text-2xl text-[#FCFBF4]">
                        As a Profypsy therapist you can earn an estimated
                    </h3>
                    <div className="flex w-full items-center justify-between text-[#F1ECCC] ">
                        <div className="flex w-1/2 flex-col items-center">
                            <Select
                                onValueChange={(value) => {
                                    setCalcPrice(parseInt(value) * 520);
                                }}
                            >
                                <SelectTrigger className="md:max-w-[100px] rounded-full text-xl text-[#205041]">
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
            <MissionSection/>
            {/* <TherapistsSection />
            <ReviewsSection /> */}
            <ApproachSection />
            <FaQSection />
            <JoinSection />
        </main>
    );
}