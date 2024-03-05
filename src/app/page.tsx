import { Button } from "@/components/ui/button";
import { HeaderT, HeadersT } from "@/models/header";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

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

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between">
            <section className="flex min-h-screen w-full flex-col items-center justify-center gap-7 bg-gradient-to-b from-[#40916C] to-[#52B788] pt-20 text-white">
                <div className="flex w-2/3 flex-col items-center gap-7 text-center">
                    <h1 className="font-playfairDSC text-5xl font-thin capitalize">
                        Your Journey to <br /> Mental Wellness Begins Here
                    </h1>
                    <h3 className="font-openSans text-2xl">
                        Choose your therapist and begin
                        <br /> your session now
                    </h3>
                    <Button className="h-fit rounded-full bg-white transition-transform duration-500 hover:scale-[1.1] hover:bg-white">
                        <p className="text-light bg-gradient-to-b from-[#23A53D] to-[#6DD864] bg-clip-text text-3xl text-transparent">
                            Get Started
                        </p>
                    </Button>
                </div>
                <div className="flex items-center justify-center gap-10">
                    {headers.map((header, index) => (
                        <HeaderCard
                            key={index}
                            title={header.title}
                            image={header.image}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}

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
