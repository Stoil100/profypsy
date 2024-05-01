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
import {
    arrayUnion,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import {
    ArrowLeft,
    ArrowRight,
    MailIcon,
    MapPinIcon,
    PhoneIcon,
    SearchCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArticleT } from "@/components/schemas/article";
import Link from "next/link";
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
type BookingCarouselProps = {
    profile: PsychologistT | null;
    user: {
        email: string | null;
        userName: string | null;
        phone: string | null;
        uid: string | null;
        role: string | null;
    };
    selectedAppointmentTime: null | string;
    setSelectedAppointmentTime: React.Dispatch<React.SetStateAction<string>>;
};
interface BookingDialogProps extends BookingCarouselProps {
    isOpen: boolean;
    onClose: () => void;
}
type BookingDatesProps = {
    profile: PsychologistT | null;
    setSelectedAppointmentTime: React.Dispatch<React.SetStateAction<string>>;
    selectedAppointmentTime: string | null;
};

const BookingDates: React.FC<BookingDatesProps> = ({
    profile,
    setSelectedAppointmentTime,
    selectedAppointmentTime,
}) => {
    const t = useTranslations("Search.id");
    const [currentWeek, setCurrentWeek] = useState(2);
    const [availableSlots, setAvailableSlots] = useState<{
        [key: string]: boolean;
    }>({});
    const daysAvailable: string[] = profile?.cost?.dates ?? [];
    console.log(daysAvailable);

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
    }, [currentWeek, profile!.uid]);

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
        // Start calculating from next week
        now.setDate(now.getDate() + 7 * Math.max(week, 1) - now.getDay());
        let dates: Date[] = [];

        daysAvailable.forEach((day) => {
            let date = new Date(now);
            date.setDate(
                date.getDate() +
                    ((7 + dayNamesToNumbers(day) - date.getDay()) % 7),
            );
            // Ensure the date is at least 7 days from today
            if (date > new Date()) dates.push(date);
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
                                <SelectValue placeholder={t("selectDate")} />
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
};

const BookingCarousel: React.FC<BookingCarouselProps> = ({
    profile,
    user,
    selectedAppointmentTime,
    setSelectedAppointmentTime,
}) => {
    const t = useTranslations("Search.id");
    const formSchema = z.object({
        userName: z.string().min(3, t("formErrors.validName")),
        info: z
            .string()
            .min(2, t("formErrors.infoRequired"))
            .max(500, t("formErrors.infoLimit")),
        session: z.string().min(1, t("formErrors.selectOption")),
        phone: z
            .string()
            .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, {
                message: t("formErrors.invalidPhone"),
            }),
        email: z.string().email({ message: t("formErrors.validEmail") }),
        age: z.string().min(1, t("formErrors.selectAge")),
    });
    const [page, setPage] = useState(0);
    const [api, setApi] = useState<CarouselApi>();
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
            new: true,
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
            new: true,
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
        <Carousel setApi={setApi} opts={{ watchDrag: false, duration: 0 }}>
            <CarouselContent className="-ml-3 h-full">
                <CarouselItem className=" flex flex-col justify-between space-y-3 rounded-xl bg-[#FCFBF4] p-2 ">
                    {page === 0 && (
                        <>
                            <div className="w-full border-b-2 text-center">
                                <h2 className="text-2xl text-black">
                                    {t("bookYourAppointment")}
                                </h2>
                                <p className="text-gray-400">
                                    {t("selectTimeSlot")}
                                </p>
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
                                        onClick={() => scrollSlide(1)}
                                    >
                                        {t("next")}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CarouselItem>
                <CarouselItem className="ml-2 w-full space-y-3 rounded-xl bg-white p-4 text-black">
                    {page === 1 && (
                        <>
                            <div className="border-b-2 p-2">
                                <h2 className="text-2xl">
                                    {t("additionalInformation")}
                                </h2>
                            </div>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
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
                                                    control={form.control}
                                                    name="phone"
                                                    render={({ field }) => (
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
                                                                    {t("age")}
                                                                </SelectLabel>
                                                                {Array.from({
                                                                    length: 100,
                                                                }).map(
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
                                                                {t("you")}
                                                            </SelectItem>
                                                            <SelectItem value="Couple">
                                                                {t("couples")}
                                                            </SelectItem>
                                                            <SelectItem value="Family">
                                                                {t("families")}
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
    );
};
const BookingDialog: React.FC<BookingDialogProps> = ({
    isOpen,
    onClose,
    profile,
    selectedAppointmentTime,
    setSelectedAppointmentTime,
    user,
}) => {
    if (!isOpen) return null;
    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                onClose();
            }}
        >
            <DialogContent className="h-fit w-full max-w-3xl border-transparent bg-gradient-to-b from-[#52B788] to-[#128665] p-2">
                <BookingCarousel
                    profile={profile}
                    selectedAppointmentTime={selectedAppointmentTime}
                    setSelectedAppointmentTime={setSelectedAppointmentTime}
                    user={user}
                />
            </DialogContent>
        </Dialog>
    );
};
export default function Page({ params }: { params: { id: string } }) {
    const t = useTranslations("Search.id");
    const { user } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<PsychologistT | null>(null);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
    const [selectedAppointmentTime, setSelectedAppointmentTime] = useState("");
    const [articles, setArticles] = useState<ArticleT[]>([]);
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
    useEffect(() => {
        function fetchArticles() {
            const q = query(
                collection(db, "articles"),
                where("creator", "==", user.uid),
                where("approved", "==", true),
                orderBy("createdAt"),
            );
            const unsubscribe = onSnapshot(
                q,
                (querySnapshot) => {
                    const tempValues: ArticleT[] = [];
                    querySnapshot.forEach((doc) => {
                        tempValues.push(doc.data() as ArticleT);
                    });
                    console.log(tempValues);
                    setArticles(tempValues);
                },
                (error) => {
                    console.error("Error fetching items: ", error);
                },
            );
            return unsubscribe;
        }
        if (profile?.variant === "Premium" || profile?.variant === "Deluxe") {
            fetchArticles();
        } else return;
    }, [profile]);
    return (
        <>
            <div className="relative flex h-full min-h-[calc(100vh-(1rem+40px))] w-full gap-4 bg-[#525174] text-[#F1ECCC] md:p-4 lg:p-8">
                <div className="w-full space-y-4 bg-black/20 p-4 font-playfairDSC md:w-2/3 md:rounded-xl">
                    <hr className="w-full justify-center rounded-full border-2 border-[#525174]" />
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex flex-col items-center gap-2 sm:items-start">
                                <img
                                    src={profile?.image!}
                                    className="size-40 rounded-full border-4 border-[#25BA9E] p-1"
                                />
                                <div className="flex flex-col items-center  justify-center gap-2 sm:items-start">
                                    {profile?.languages?.map(
                                        (language, index) => (
                                            <Badge
                                                className="w-fit border-2 border-[#40916C] bg-[#FCFBF4] text-xl"
                                                key={index}
                                            >
                                                <div className="flex h-full w-full items-center gap-2 bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-transparent">
                                                    <img
                                                        src={
                                                            language ===
                                                            "Bulgarian"
                                                                ? "/logic/bg.png"
                                                                : language ===
                                                                    "Български"
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
                            <div className="flex flex-1 flex-col items-center justify-between gap-4 sm:items-start">
                                <div>
                                    <h2 className="text-4xl ">
                                        {profile?.userName}
                                    </h2>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg text-gray-400">
                                            &quot;{profile?.quote!}&quot;
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <MapPinIcon />
                                            <p className="text-xl">
                                                {profile?.location!}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 text-[#FCFBF4]">
                                        <div className="flex items-center gap-2">
                                            <MailIcon />
                                            <p className="text-sm">
                                                {profile?.email!}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon />
                                            <p className="text-xl">
                                                {profile?.phone!}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-2xl">
                                        {t("specializations")}:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {profile?.specializations?.map(
                                            (speciality, index) => (
                                                <Badge
                                                    className="border-2 border-[#40916C] bg-[#FCFBF4] text-xl"
                                                    key={index}
                                                >
                                                    <p className="h-full w-full text-nowrap bg-gradient-to-b from-[#40916C] to-[#52B788] bg-clip-text text-transparent">
                                                        {speciality}
                                                    </p>
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                </div>
                                <hr className="w-full rounded-full border-2 border-[#40916C]" />
                                <MainButton
                                    className="w-full text-xl"
                                    onClick={() => setIsBookingDialogOpen(true)}
                                >
                                    {t("bookNow")}
                                </MainButton>
                            </div>
                        </div>
                        <div className="min-w-lg mx-4 flex h-fit min-h-48 flex-1 flex-col items-center justify-center gap-2 self-center rounded-xl border-4 border-[#40916C] bg-[#FCFBF4] p-2 text-center text-[#40916C]">
                            <p className="text-2xl">{t("pricePerHour")}:</p>
                            <hr className="w-2/3 rounded-full border-2 border-[#40916C]" />
                            <p className="place-self-center text-5xl font-bold italic">
                                {profile?.cost?.price} Lv
                            </p>
                        </div>
                    </div>
                    <hr className="w-full rounded-full border-2 border-[#525174]" />
                    <div className="h-max w-full space-y-4 rounded-lg px-2 font-openSans text-[#FCFBF4]">
                        <div className="space-y-2 ">
                            <h3 className="text-4xl">{t("aboutMe")}:</h3>
                            <p className="px-2 text-lg">{profile?.about!}</p>
                        </div>
                        <hr className="w-full rounded-full border-2 border-[#25BA9E]" />
                        <div className="flex w-full flex-wrap gap-2">
                            <div className="flex-1">
                                <h4 className="text-2xl">{t("education")}:</h4>
                                <ul className=" list-inside list-disc divide-y-2 rounded-xl p-2 px-4 text-left">
                                    {profile?.educations!.map((el, index) => (
                                        <li
                                            key={index}
                                            className="line-clamp-2 list-item text-xl capitalize"
                                        >
                                            {el.education}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-2xl">
                                    {t("workExperience")}:
                                </h4>
                                <ul className=" list-inside list-disc divide-y-2 rounded-xl p-2 px-4 text-left">
                                    {profile?.experiences!.map((exp, index) => (
                                        <li
                                            key={index}
                                            className="line-clamp-2 list-item text-xl capitalize"
                                        >
                                            {exp.experience}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <MainButton
                                className="w-full text-xl hover:scale-105"
                                onClick={() => setIsBookingDialogOpen(true)}
                            >
                                {t("bookNow")}
                            </MainButton>
                        </div>
                    </div>
                    <hr className="w-full rounded-full border-2 border-[#525174]" />
                    {articles.length > 0 && (
                        <>
                            <div className="space-y-2 font-openSans">
                                <h2 className="text-3xl text-[#FCFBF4]">
                                    {t("myArticles")}:
                                </h2>
                                <div className="flex flex-wrap justify-center gap-4 text-[#25BA9E]">
                                    {articles.map((article, index) => (
                                        <Link
                                            key={index}
                                            href={`/articles/${article.id}`}
                                            className="max-w-xs rounded-xl bg-black/50 p-2 transition-transform hover:scale-105"
                                        >
                                            <img
                                                src={article.image}
                                                className=" h-auto w-auto rounded-lg"
                                            />
                                            <h5 className="text-xl">
                                                {article.title}
                                            </h5>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <hr className="w-full rounded-full border-2 border-[#525174]" />
                        </>
                    )}
                </div>
                <div className="sticky top-[calc(1rem+60px)] hidden max-h-[calc(100vh-(1rem+100px))] w-1/3 items-center justify-center rounded-xl border-4 border-[#25BA9E] bg-[#FCFBF4] md:flex">
                    {user.uid && profile?.uid && (
                        <BookingCarousel
                            profile={profile}
                            user={user}
                            setSelectedAppointmentTime={
                                setSelectedAppointmentTime
                            }
                            selectedAppointmentTime={selectedAppointmentTime}
                        />
                    )}
                </div>
            </div>
            <BookingDialog
                isOpen={isBookingDialogOpen}
                onClose={() => setIsBookingDialogOpen(false)}
                profile={profile}
                user={user}
                selectedAppointmentTime={selectedAppointmentTime}
                setSelectedAppointmentTime={setSelectedAppointmentTime}
            />
        </>
    );
}
