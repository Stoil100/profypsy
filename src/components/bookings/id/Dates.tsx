import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/firebase/config";
import { PsychologistT } from "@/models/psychologist";
import { addDays, addWeeks, format, startOfWeek } from "date-fns";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

type BookingDatesProps = {
    profile: PsychologistT | null;
    setSelectedAppointmentTime: React.Dispatch<
        React.SetStateAction<string | null>
    >;
    selectedAppointmentTime: string | null;
    t: (args: string) => string;
};

export function BookingDates({
    profile,
    setSelectedAppointmentTime,
    selectedAppointmentTime,
    t,
}: BookingDatesProps) {
    const [currentWeek, setCurrentWeek] = useState(2);
    const [availableSlots, setAvailableSlots] = useState<{
        [key: string]: boolean;
    }>({});

    const daysAvailable: string[] = profile?.dates ?? [];

    const fetchAvailability = async (dates: Date[]) => {
        const profileDocRef = doc(db, "psychologists", profile!.uid);
        try {
            const docSnap = await getDoc(profileDocRef);
            if (docSnap.exists()) {
                const { appointments } = docSnap.data() as {
                    appointments: { selectedDate: string }[];
                };
                const availability: { [key: string]: boolean } = {};
                dates.forEach((date) => {
                    const slotsForDate = generateTimeSlotsForDate(date);
                    const dateStr = format(date, "yyyy-MM-dd");
                    const slots = slotsForDate[dateStr];

                    if (slots) {
                        slots.forEach((slot: string) => {
                            const selectedDateTime = `${dateStr} ${slot}`;
                            availability[selectedDateTime] = !appointments.some(
                                (appointment) =>
                                    appointment.selectedDate ===
                                    selectedDateTime,
                            );
                        });
                    }
                });
                setAvailableSlots(availability);
            }
        } catch (error) {
            console.error("Error fetching availability: ", error);
        }
    };

    useEffect(() => {
        const dates = getDatesForWeek(currentWeek);
        fetchAvailability(dates);
    }, [currentWeek, profile?.uid, daysAvailable]);

    function dayNamesToNumbers(dayName: string): number {
        const days: string[] = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        return days.indexOf(dayName.toLowerCase());
    }

    function generateTimeSlotsForDate(date: Date): {
        [date: string]: string[];
    } {
        const dateStr = format(date, "yyyy-MM-dd");
        const slots: string[] = [];
        const startTime = 11;
        const endTime = 18;

        for (let hour = startTime; hour < endTime; hour++) {
            const time = `${hour}:00 - ${hour + 1}:00`;
            slots.push(time);
        }

        return { [dateStr]: slots };
    }

    function getDatesForWeek(week: number): Date[] {
        const now = new Date();
        const startDate = startOfWeek(addWeeks(now, week));
        const dates: Date[] = [];

        daysAvailable.forEach((day) => {
            const dayNumber = dayNamesToNumbers(day);
            const date = addDays(startDate, dayNumber);
            if (date > now) dates.push(date);
        });

        return dates.sort((a, b) => a.getTime() - b.getTime());
    }

    function aggregateTimeSlots(dates: Date[]): {
        [date: string]: string[];
    } {
        return dates.reduce(
            (acc, date) => {
                const slotsForDate = generateTimeSlotsForDate(date);
                const dateStr = format(date, "yyyy-MM-dd");
                acc[dateStr] = slotsForDate[dateStr];
                return acc;
            },
            {} as { [date: string]: string[] },
        );
    }

    return (
        <div className="flex h-full flex-col items-center justify-center space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-4">
                {Object.entries(
                    aggregateTimeSlots(getDatesForWeek(currentWeek)),
                ).map(([date, slots]) => (
                    <div key={date}>
                        <h3 className="text-xl text-[#128665]">
                            {format(new Date(date), "MMMM d, yyyy")}:
                        </h3>
                        <Select>
                            <SelectTrigger className="w-full border-[#52B788] text-[#52B788]">
                                <SelectValue placeholder={t("selectDate")} />
                            </SelectTrigger>
                            <SelectContent className="z-[150]">
                                <SelectGroup className="flex h-fit flex-col gap-2">
                                    {slots.map((slot) => (
                                        <Button
                                            key={slot}
                                            variant="outline"
                                            value={`${date} ${slot}`}
                                            disabled={
                                                !availableSlots[
                                                    `${date} ${slot}`
                                                ]
                                            }
                                            className={`flex cursor-pointer items-center justify-center rounded-xl border-2 text-base ${
                                                !availableSlots[
                                                    `${date} ${slot}`
                                                ]
                                                    ? "border-gray-400 text-gray-400"
                                                    : "border-[#52B788] text-[#52B788] hover:!bg-[#52B788] hover:!text-white"
                                            } ${selectedAppointmentTime === `${date} ${slot}` && "!bg-[#52B788] !text-white"}`}
                                            onClick={() =>
                                                setSelectedAppointmentTime(
                                                    `${date} ${slot}`,
                                                )
                                            }
                                        >
                                            {slot}
                                        </Button>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                ))}
            </div>
            {selectedAppointmentTime && (
                <h2 className="text-center text-[#128665]">
                    {t("selectedAppointment")} {selectedAppointmentTime}
                </h2>
            )}
            <div className="flex w-full justify-center gap-4 self-center">
                <Button
                    variant="outline"
                    className="size-10 rounded-full border-2 border-[#52B788] p-0 text-[#52B788]"
                    onClick={() =>
                        setCurrentWeek((current) => Math.max(current - 1, 2))
                    }
                >
                    <ArrowLeft />
                </Button>
                <Button
                    variant="outline"
                    className="size-10 rounded-full border-2 border-[#128665] p-0 text-[#128665]"
                    onClick={() => setCurrentWeek((current) => current + 1)}
                >
                    <ArrowRight />
                </Button>
            </div>
        </div>
    );
}
