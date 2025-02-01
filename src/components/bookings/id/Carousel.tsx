import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useState } from "react";

import BookingForm from "@/components/forms/booking/Content";
import { Button } from "@/components/ui/button";
import { PsychologistT } from "@/models/psychologist";
import { UserType } from "@/models/user";
import { BookingDates } from "./Dates";

type BookingCarouselProps = {
    profile: PsychologistT | null;
    user: UserType;
    selectedAppointmentTime: string | null;
    setSelectedAppointmentTime: React.Dispatch<
        React.SetStateAction<string | null>
    >;
    t: (args: string) => string;
};

export function BookingCarousel({
    profile,
    user,
    selectedAppointmentTime,
    setSelectedAppointmentTime,
    t,
}: BookingCarouselProps) {
    const [api, setApi] = useState<CarouselApi>();

    const scrollSlide = (page: number) => {
        api?.scrollTo(page);
    };

    return (
        <Carousel setApi={setApi} opts={{ watchDrag: false, duration: 0 }}>
            <CarouselContent className="ml-0 h-full">
                <CarouselItem className="flex flex-col justify-between space-y-3 rounded-xl bg-[#FCFBF4] p-2 ">
                    <div className="w-full border-b-2 text-center">
                        <h2 className="text-2xl text-black">
                            {t("bookYourAppointment")}
                        </h2>
                        <p className="text-gray-400">{t("selectTimeSlot")}</p>
                    </div>
                    <BookingDates
                        t={(key) => t(`dates.${key}`)}
                        profile={profile}
                        setSelectedAppointmentTime={setSelectedAppointmentTime}
                        selectedAppointmentTime={selectedAppointmentTime}
                    />
                    {selectedAppointmentTime && (
                        <div className="flex w-full items-center justify-center">
                            <Button
                                variant="outline"
                                className="rounded-full border-2 border-[#52B788] text-xl text-[#52B788]"
                                onClick={() => scrollSlide(1)}
                            >
                                {t("next")}
                            </Button>
                        </div>
                    )}
                </CarouselItem>
                <CarouselItem className="ml-2 w-full space-y-3 rounded-xl bg-white p-4 text-black">
                    <div className="border-b-2 p-2">
                        <h2 className="text-2xl">
                            {t("additionalInformation")}
                        </h2>

                        <BookingForm
                            t={(key) => t(`form.${key}`)}
                            user={user}
                            profile={profile}
                            selectedAppointmentTime={selectedAppointmentTime}
                            scrollSlide={scrollSlide}
                        />
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
}
