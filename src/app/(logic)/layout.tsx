import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="bg-[#F7F4E0]">
            {children}
        </section>
    );
}
{/* <Dialog>
<DialogTrigger>
    <GradientButton className="text-3xl">
        Book Now
    </GradientButton>
</DialogTrigger>
<DialogContent>
    <Carousel>
        <CarouselContent>
            <CarouselItem>
                <Carousel>
                    <CarouselContent>
                        <CarouselItem>...</CarouselItem>
                        <CarouselItem>...</CarouselItem>
                        <CarouselItem>...</CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </CarouselItem>
            <CarouselItem>...</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
    </Carousel>
</DialogContent>
</Dialog> */}