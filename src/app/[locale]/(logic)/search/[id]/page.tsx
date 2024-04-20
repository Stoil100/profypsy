"use client";
import MainButton from "@/components/MainButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import { useAuth } from "@/components/Providers";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/firebase/config";
import { AppointmentT } from "@/models/appointment";
import { PsychologistT } from "@/models/psychologist";
import { zodResolver } from "@hookform/resolvers/zod";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import {
    ArrowLeft,
    ArrowRight,
    GraduationCap,
    Handshake,
    Info,
    SearchCheck,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
const Loader = () => {
    const t = useTranslations("Search");
    return (
        <div className="fixed top-0 flex h-screen w-full flex-col items-center justify-center gap-5">
            <SearchCheck className="animate-bounce text-[#205041]" size={90} />
            <h2 className="font-playfairDSC text-5xl text-[#205041]">
                {t("loadingSelection")}
            </h2>
            <p className="text-xl text-[#128665]">{t("tailoredSearch")}</p>
        </div>
    );
};
//     variant,
//     userName,
//     location,
//     image,
//     about,
//     experiences,
// }: SubmitValues) => (
//     <div className="relative flex w-fit max-w-[300px] flex-col items-center justify-between gap-4 rounded-3xl bg-[#FCFBF4] p-6">
//         <Badge
//             className={cn(
//                 "absolute -left-3 -top-3 text-white",
//                 variant === "ultra"
//                     ? "bg-[#FCD96A]"
//                     : variant === "premium"
//                       ? "bg-[#FC8A6A]"
//                       : variant === "trial"
//                         ? "bg-[#99B6ED]"
//                         : "bg-gradient-to-b from-[#F7F4E0] to-[#F1ECCC] border-none text-black",
//             )}
//         >
//             {variant === "ultra"
//                 ? "Best suited"
//                 : variant === "premium"
//                   ? "Recommended by us"
//                   : variant === "trial"
//                     ? "Freshly found"
//                     : "Strong match"}
//         </Badge>
//         <img src={} className="size-28 rounded" />
//         <div className="flex w-full flex-col items-start justify-center gap-2">
//             <h4 className="text-3xl text-[#205041]">{name}</h4>
//             <div className="flex  w-fit items-center justify-center gap-1">
//                 <Pin color="#08BF6B" />
//                 <p className="text-[#205041]">{location}</p>
//             </div>
//             <p className="text-[#20504180]">{experience}</p>
//             <p className="text-[#205041]">{description}</p>
//         </div>
//         <Button className="w-full bg-gradient-to-b from-[#40916C] to-[#52B788] text-white">
//             Book Now
//         </Button>
//     </div>
// );
type BookingDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    profile: PsychologistT | null;
    user: {
        email: string | null;
        userName: string | null;
        phone: string | null;
        uid: string | null;
        role: string | null;
    };
};
type BookingDatesProps = {
    profile: PsychologistT | null;
    setSelectedAppointmentTime: (value: string) => void;
    selectedAppointmentTime: string | null;
};

export default function Page({ params }: { params: { id: string } }) {
    const t = useTranslations("Search.id");
    const { user } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<PsychologistT | null>(null);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
    const [selectedAppointmentTime, setSelectedAppointmentTime] =
        useState(null);
    useEffect(() => {
        if (!user.uid) {
            router.push("/login");
        }
    }, [router, user]);
    useEffect(() => {
        async function fetchItems() {
            if (!params.id) return; // Exit early if search or params.id is undefined
            try {
                const docRef = doc(db, "psychologists", params.id);
                const docSnap = await getDoc(docRef);
                setProfile(docSnap.data()! as PsychologistT);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchItems();
    }, [params]);
    const formSchema = z.object({
        userName: z.string().min(3, t("formErrors.validName")),
        info: z
            .string()
            .min(2, t("formErrors.infoRequired"))
            .max(500, t("formErrors.infoLimit")),
        session: z.string().min(1, t("formErrors.selectOption")),
        phone: z
            .string()
            .regex(
                /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
                {message:t("formErrors.invalidPhone")},
            ),
        email: z.string().email({message:t("formErrors.validEmail")}),
        age: z.string().min(1, t("formErrors.selectAge")),
    });
    const BookingDates: React.FC<BookingDatesProps> = ({
        profile,
        setSelectedAppointmentTime,
        selectedAppointmentTime,
    }) => {
        const [currentWeek, setCurrentWeek] = useState(0);
        const [availableSlots, setAvailableSlots] = useState<{
            [key: string]: boolean;
        }>({});
        const daysAvailable: string[] = profile?.cost?.dates ?? [];

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
                        const dateStr = date.toDateString();
                        const slots = slotsForDate[dateStr];

                        if (slots) {
                            slots.forEach((slot: string) => {
                                const selectedDateTime = `${dateStr} ${slot}`;
                                availability[selectedDateTime] =
                                    !appointments.some(
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
        }, [currentWeek, profile!.uid]);

        function dayNamesToNumbers(dayName: string): number {
            const days: string[] = [
                t("days.sunday"),
                t("days.monday"),
                t("days.tuesday"),
                t("days.wednesday"),
                t("days.thursday"),
                t("days.friday"),
                t("days.saturday"),
            ];
            return days.indexOf(dayName.toLowerCase());
        }

        function generateTimeSlotsForDate(date: Date): {
            [date: string]: string[];
        } {
            const dateStr = date.toDateString();
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
            now.setDate(now.getDate() + 7 * week - now.getDay());
            let dates: Date[] = [];

            daysAvailable.forEach((day) => {
                let date = new Date(now);
                date.setDate(
                    date.getDate() +
                        ((7 + dayNamesToNumbers(day) - date.getDay()) % 7),
                );
                dates.push(date);
            });

            return dates.sort((a, b) => a.getTime() - b.getTime());
        }

        function aggregateTimeSlots(dates: Date[]): {
            [date: string]: string[];
        } {
            return dates.reduce(
                (acc, date) => {
                    const slotsForDate = generateTimeSlotsForDate(date);
                    const dateStr = Object.keys(slotsForDate)[0];
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
                            <h3 className="text-xl text-[#128665]">{date}:</h3>
                            <Select key={date}>
                                <SelectTrigger className="w-full border-[#52B788] text-[#52B788]">
                                    <SelectValue
                                        placeholder={t("selectDate")}
                                    />
                                </SelectTrigger>
                                <SelectContent className="z-[150]">
                                    <SelectGroup className="flex h-fit flex-col gap-2">
                                        {slots.map((slot) => (
                                            <Button
                                                variant="outline"
                                                value={`${date} ${slot}`}
                                                key={slot}
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
                    <h2 className="text-center">
                        {t("selectedAppointment")} {selectedAppointmentTime}
                    </h2>
                )}
                <div className="flex w-full justify-center gap-4 self-center">
                    <Button
                        variant="outline"
                        className="size-10 rounded-full border-2 border-[#52B788] p-0 text-[#52B788]"
                        onClick={() =>
                            setCurrentWeek((current) =>
                                Math.max(current - 1, 0),
                            )
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
    };
    const BookingDialog: React.FC<BookingDialogProps> = ({
        isOpen,
        onClose,
        profile,
        user,
    }) => {
        const [page, setPage] = useState(0);
        const [api, setApi] = useState<CarouselApi>();
        const [selectedAppointmentTime, setSelectedAppointmentTime] = useState<
            string | null
        >(null);
        const router = useRouter();
        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                userName: user.userName!,
                phone: user.phone!,
                email: user.email!,
                session: "",
                age: "18",
            },
        });
        if (!isOpen) return null;
        const scrollSlide = (page: number) => {
            setPage(page);
            api?.scrollTo(page);
        };
        const onSubmit = async (values: z.infer<typeof formSchema>) => {
            if (!user) return;
            const tempPsychologistValues: AppointmentT = {
                ...values,
                selectedDate: selectedAppointmentTime!,
                clientUid: user!.uid!,
                psychologistUid: profile?.uid!,
            };
            const tempUserValues: AppointmentT = {
                userName: profile?.userName!,
                email: profile?.email!,
                phone: profile?.phone!,
                info: values.info!,
                session: values.session!,
                age: profile?.age!,
                selectedDate: selectedAppointmentTime!,
                clientUid: user?.uid!,
                psychologistUid: profile!.uid!,
            };
            const psychologistProfileDocRef = doc(
                db,
                "psychologists",
                profile!.uid,
            );
            const userProfileDocRef = doc(db, "users", user!.uid!);
            try {
                await updateDoc(psychologistProfileDocRef, {
                    appointments: arrayUnion(tempPsychologistValues),
                });
                await updateDoc(userProfileDocRef, {
                    appointments: arrayUnion(tempUserValues),
                }),
                    toast({
                        title: "Scheduled appointment for: ",
                        description: `${selectedAppointmentTime}`,
                    });
                router.push("/search");
            } catch (error) {
                console.error("Error adding appointment: ", error);
            }
        };
        return (
            <Dialog
                open={isOpen}
                onOpenChange={() => {
                    onClose();
                    setPage(0);
                }}
            >
                <DialogContent className="h-fit w-full max-w-3xl border-transparent bg-gradient-to-b from-[#52B788] to-[#128665] p-2">
                    <Carousel
                        setApi={setApi}
                        opts={{ watchDrag: false, duration: 0 }}
                    >
                        <CarouselContent className="h-fit px-2">
                            <CarouselItem className="ml-2 flex flex-col justify-between space-y-3 rounded-xl bg-white p-2">
                                {page === 0 && (
                                    <>
                                        <div className="w-full border-b-2 text-center">
                                            <h2 className="text-2xl">
                                                {t("bookYourAppointment")}
                                            </h2>
                                            <p>{t("selectTimeSlot")}</p>
                                        </div>
                                        <BookingDates
                                            profile={profile}
                                            setSelectedAppointmentTime={
                                                setSelectedAppointmentTime
                                            }
                                            selectedAppointmentTime={
                                                selectedAppointmentTime
                                            }
                                        />
                                        {selectedAppointmentTime && (
                                            <div className="flex w-full items-center justify-center">
                                                <Button
                                                    variant="outline"
                                                    className="rounded-full border-2 border-[#52B788] text-xl text-[#52B788]"
                                                    onClick={() =>
                                                        scrollSlide(1)
                                                    }
                                                >
                                                    {t("next")}
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CarouselItem>
                            <CarouselItem className="ml-2 w-full space-y-3 rounded-xl bg-white p-2">
                                {page === 1 && (
                                    <>
                                        <div className="border-b-2 p-2">
                                            <h2 className="text-2xl">
                                                {t("additionalInformation")}
                                            </h2>
                                        </div>
                                        <Form {...form}>
                                            <form
                                                onSubmit={form.handleSubmit(
                                                    onSubmit,
                                                )}
                                                className="w-full space-y-4 bg-white py-2"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="userName"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>
                                                                {t("firstName")}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder={t(
                                                                        "enterYourName",
                                                                    )}
                                                                    {...field}
                                                                    className="rounded-2xl border-2 border-[#52B788]"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="flex w-full items-end justify-center gap-2">
                                                    <div className="w-full">
                                                        <FormLabel>
                                                            {t("telephone")}
                                                        </FormLabel>
                                                        <div className="flex items-center justify-center rounded-full border-2 border-[#52B788] px-2">
                                                            <img
                                                                src="/logic/bg.png"
                                                                className="h-8"
                                                            />
                                                            <FormField
                                                                control={
                                                                    form.control
                                                                }
                                                                name="phone"
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormItem className="w-full ">
                                                                        <FormControl>
                                                                            <Input
                                                                                placeholder={t(
                                                                                    "enterYourPhone",
                                                                                )}
                                                                                {...field}
                                                                                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <FormField
                                                        control={form.control}
                                                        name="age"
                                                        render={({ field }) => (
                                                            <FormItem className="w-full">
                                                                <Select
                                                                    onValueChange={
                                                                        field.onChange
                                                                    }
                                                                    defaultValue={`${field.value}`}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger className="w-full rounded-xl border-2 border-[#52B788] text-xl">
                                                                            <SelectValue
                                                                                placeholder={t(
                                                                                    "selectYourAge",
                                                                                )}
                                                                                defaultValue={
                                                                                    field.value
                                                                                }
                                                                            />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectGroup>
                                                                            <SelectLabel>
                                                                                {t(
                                                                                    "age",
                                                                                )}
                                                                            </SelectLabel>
                                                                            {Array.from(
                                                                                {
                                                                                    length: 100,
                                                                                },
                                                                            ).map(
                                                                                (
                                                                                    _,
                                                                                    index,
                                                                                ) => (
                                                                                    <SelectItem
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        value={`${index + 14}`}
                                                                                    >
                                                                                        {index +
                                                                                            14}
                                                                                    </SelectItem>
                                                                                ),
                                                                            )}
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full ">
                                                            <FormLabel>
                                                                {t("email")}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder={t(
                                                                        "enterYourEmail",
                                                                    )}
                                                                    {...field}
                                                                    className="rounded-2xl border-2 border-[#52B788] "
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="session"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <Select
                                                                onValueChange={
                                                                    field.onChange
                                                                }
                                                                defaultValue={`${field.value}`}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full rounded-xl border-2 border-[#52B788] text-xl">
                                                                        <SelectValue
                                                                            placeholder={t(
                                                                                "sessionFor",
                                                                            )}
                                                                            defaultValue={
                                                                                field.value
                                                                            }
                                                                        />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectGroup>
                                                                        <SelectLabel>
                                                                            {t(
                                                                                "sessionFor",
                                                                            )}
                                                                        </SelectLabel>
                                                                        <SelectItem value="You">
                                                                            {t(
                                                                                "you",
                                                                            )}
                                                                        </SelectItem>
                                                                        <SelectItem value="Couple">
                                                                            {t(
                                                                                "couples",
                                                                            )}
                                                                        </SelectItem>
                                                                        <SelectItem value="Family">
                                                                            {t(
                                                                                "families",
                                                                            )}
                                                                        </SelectItem>
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="info"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel>
                                                                {t("info")}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder={t(
                                                                        "additionalInfoPlaceholder",
                                                                    )}
                                                                    {...field}
                                                                    className="rounded-2xl border-2 border-dashed border-[#52B788]"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="flex w-full justify-between">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="rounded-full border-2 border-[#52B788] text-xl text-[#52B788]"
                                                        onClick={() => {
                                                            scrollSlide(0);
                                                        }}
                                                    >
                                                        {t("previous")}
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="outline"
                                                        className="rounded-full border-2 bg-[#52B788] text-xl text-white transition-all hover:scale-110 hover:bg-[#3e8b67] hover:text-white"
                                                    >
                                                        {t("submit")}
                                                    </Button>
                                                </div>
                                            </form>
                                        </Form>
                                    </>
                                )}
                            </CarouselItem>
                        </CarouselContent>
                    </Carousel>
                </DialogContent>
            </Dialog>
        );
    };
    return (
        <>
            {!profile && <Loader />}
            <section className="flex min-h-screen w-full flex-col items-center justify-center gap-5 bg-[#F1ECCC] py-2 text-center text-[#205041]">
                <div className="mt-20 flex w-full max-w-[90vw] flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-3">
                    {/* First column for professional standards and languages */}
                    <div className="order-2 h-full w-full rounded-2xl bg-gradient-to-b from-[#40916C] to-[#52B788] p-3 shadow-2xl transition-transform hover:scale-105 md:col-span-1 lg:order-1">
                        <div className="flex h-full w-full flex-col justify-between space-y-6 rounded-xl bg-[#FCFBF4] px-2 py-4">
                            <div className="flex w-fit items-center justify-center self-center rounded-full border-2 border-[#205041] p-2">
                                <Handshake />
                            </div>
                            <h2 className="text-3xl">
                                {t("professionalStandards")}
                            </h2>
                            <hr className="w-full rounded-full border-2 border-[#40916C]" />
                            <h4 className="text-2xl">{t("specializations")}</h4>
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {profile?.specializations?.map(
                                    (speciality, index) => (
                                        <Badge
                                            className="border-2 border-[#40916C] bg-[#FCFBF4] text-xl"
                                            key={index}
                                        >
                                            <div className="h-full w-full bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-transparent">
                                                {speciality}
                                            </div>
                                        </Badge>
                                    ),
                                )}
                            </div>
                            <div className="flex items-center justify-around divide-x-2 divide-black rounded-xl border-4 border-[#40916C] bg-[#FCFBF4] p-2">
                                <div className="w-1/2 divide-y-2 divide-black">
                                    <p className="text-2xl">{t("duration")}</p>
                                    <p className="text-xl">{t("minutes")}</p>
                                </div>
                                <div className="w-1/2 divide-y-2 divide-black">
                                    <p className="text-2xl">{t("price")}</p>
                                    <p className="text-xl">
                                        {profile?.cost?.price} Lv
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <h4 className="text-2xl">{t("languages")}</h4>
                                <div className="flex items-center justify-center gap-2">
                                    {profile?.languages?.map(
                                        (language, index) => (
                                            <Badge
                                                className="border-2 border-[#40916C] bg-[#FCFBF4] text-xl"
                                                key={index}
                                            >
                                                <div className="flex h-full w-full items-center gap-2 bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-transparent">
                                                    <img
                                                        src={
                                                            language ===
                                                            "Bulgarian"
                                                                ? "/logic/bg.png"
                                                                : "/logic/en.png"
                                                        }
                                                        alt={language}
                                                    />
                                                    <p className="capitalize">
                                                        {language}
                                                    </p>
                                                </div>
                                            </Badge>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 h-full w-full rounded-2xl bg-gradient-to-b from-[#40916C] to-[#52B788] p-3 shadow-2xl transition-transform hover:scale-105  md:col-span-1 lg:order-2">
                        <div className="flex h-full w-full flex-col items-center justify-between space-y-2 rounded-xl bg-[#FCFBF4] px-2 py-4">
                            <div className="flex w-fit items-center justify-center self-center rounded-full border-2 border-[#205041] p-2">
                                <Info />
                            </div>
                            <h2 className="text-3xl">{t("generalInfo")}</h2>
                            <hr className="w-full rounded-full border-2 border-[#40916C]" />
                            {profile?.image ? (
                                <img
                                    src={profile?.image}
                                    alt={profile?.userName}
                                    className="h-32 w-32 rounded-full"
                                />
                            ) : (
                                <div className="rounded-full border-2 p-2 ">
                                    <User />
                                </div>
                            )}
                            <h3 className="text-3xl">{profile?.userName}</h3>
                            <div className=" space-y-2 rounded-2xl border-4 border-[#40916C] px-4 py-2">
                                <h4 className="text-2xl">{t("aboutMe")}</h4>
                                <p className="line-clamp-3 break-all text-xl ">
                                    {profile?.about}
                                </p>
                            </div>
                            <div className=" space-y-2 rounded-2xl border-4 border-[#40916C] px-4 py-2">
                                <h4 className="text-2xl">{t("myPersonalQuote")}</h4>
                                <p className="w-full break-all rounded-2xl bg-[#FCFBF4] text-xl italic text-[#205041]">
                                    &quot;{profile?.quote}&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="order-3 h-full w-full rounded-2xl bg-gradient-to-b from-[#40916C] to-[#52B788] p-3 shadow-2xl transition-transform hover:scale-105  md:col-span-2 lg:col-span-1">
                        <div className="items-between flex h-full w-full flex-col justify-center space-y-4 rounded-xl bg-[#FCFBF4] px-2 py-4">
                            <div className="flex w-fit items-center justify-center self-center rounded-full border-2 border-[#205041] p-2">
                                <GraduationCap />
                            </div>
                            <h2 className="text-3xl">{t("myExperience")}</h2>
                            <hr className="w-full rounded-full border-2 border-[#40916C]" />
                            <div className="col-span-1 space-y-4">
                                <div className="rounded-2xl border-4 border-[#40916C]">
                                    <h4 className="text-2xl">
                                    {t("workExperience")}
                                    </h4>
                                    <ul className="list-decimal divide-y-2 divide-black rounded-xl bg-[#FCFBF4] p-2 text-left">
                                        {profile?.experiences!.map(
                                            (exp, index) => (
                                                <li
                                                    key={index}
                                                    className="line-clamp-2 break-all text-xl"
                                                >
                                                    {exp.experience}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                                <div className="rounded-2xl border-4 border-[#40916C]">
                                    <h4 className="text-2xl">{t("education")}</h4>
                                    <ul className="list-decimal divide-y-2 divide-black rounded-xl bg-[#FCFBF4] p-2 text-left">
                                        {profile?.educations!.map(
                                            (el, index) => (
                                                <li
                                                    key={index}
                                                    className="line-clamp-2 break-all text-xl capitalize"
                                                >
                                                    {el.education}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {selectedAppointmentTime && (
                    <p>
                        {t("selectedAppointment")} {selectedAppointmentTime}
                    </p>
                )}
                <MainButton
                    className="text-xl"
                    onClick={() => setIsBookingDialogOpen(true)}
                >
                    {t("bookNow")}
                </MainButton>
            </section>
            <BookingDialog
                isOpen={isBookingDialogOpen}
                onClose={() => setIsBookingDialogOpen(false)}
                profile={profile}
                user={user}
            />
        </>
    );
}
