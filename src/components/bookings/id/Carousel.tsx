import BookingForm from "@/components/forms/booking/Content";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import type { PsychologistT } from "@/models/psychologist";
import type { UserType } from "@/models/user";
import type React from "react";
import { useState } from "react";
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

    return (
        <Carousel
            setApi={setApi}
            opts={{ watchDrag: false, duration: 0 }}
            className="flex h-full w-full flex-col justify-center bg-[#FCFBF4]"
        >
            <CarouselContent className="ml-0 h-full flex-grow ">
                <CarouselItem className="h-full overflow-y-auto">
                    <div className="flex h-full flex-col justify-between gap-4 p-4">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-black">
                                {t("bookYourAppointment")}
                            </h2>
                            <p className="text-gray-600">
                                {t("selectTimeSlot")}
                            </p>
                        </div>
                        <div className="flex-grow">
                            <BookingDates
                                t={(key) => t(`dates.${key}`)}
                                profile={profile}
                                setSelectedAppointmentTime={
                                    setSelectedAppointmentTime
                                }
                                selectedAppointmentTime={
                                    selectedAppointmentTime
                                }
                            />
                        </div>
                        {selectedAppointmentTime && (
                            <div className="mt-4 flex justify-center p-2">
                                <Button
                                    variant="outline"
                                    className="rounded-full border-2 border-[#52B788] px-8 py-2 text-xl text-[#52B788]"
                                    onClick={() => api?.scrollNext()}
                                >
                                    {t("next")}
                                </Button>
                            </div>
                        )}
                    </div>
                </CarouselItem>
                <CarouselItem className="h-full p-4">
                    <div className="flex h-full flex-col space-y-4">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-black">
                                {t("additionalInformation")}
                            </h2>
                        </div>
                        <div className="flex-grow overflow-y-auto">
                            <BookingForm
                                t={(key) => t(`form.${key}`)}
                                user={user}
                                profile={profile}
                                selectedAppointmentTime={
                                    selectedAppointmentTime
                                }
                                carouselApi={api}
                            />
                        </div>
                    </div>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    );
}
