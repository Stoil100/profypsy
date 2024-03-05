import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const headers = [
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
                    <Button className="h-fit  rounded-full  bg-white hover:bg-white hover:scale-[1.1] transition-transform duration-500">
                        <p className="bg-gradient-to-b from-[#23A53D] to-[#6DD864] bg-clip-text text-3xl text-light text-transparent">
                            Get Started
                        </p>
                    </Button>
                </div>
                <div className="flex justify-center items-center gap-10">
                  {headers.map(header => (
                    <div className="w-full flex justify-between items-center flex-col bg-[#B2D3A8] p-3 rounded-3xl gap-2 hover:scale-105 transition-transform cursor-pointer">
                      <img src={header.image} className="size-72"/>
                      <div className="w-full flex justify-between items-center">
                        <h4 className="text-lg ">{header.title}</h4>
                        <ChevronRight/>
                      </div>
                    </div>

                  ))}
                </div>
            </section>
        </main>
    );
}
