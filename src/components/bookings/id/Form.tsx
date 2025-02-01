import { BookingSchema } from "@/components/schemas/booking";
import { Button } from "@/components/ui/button";
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
import { PsychologistT } from "@/models/psychologist";
import { UserType } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

type BookingFormProps = {
    t: (arg: string) => string;
    profile: PsychologistT | null;
    user: UserType;
    selectedAppointmentTime: string | null;
    scrollSlide: (page: number) => void;
};
export default function BookingForm({
    t,
    profile,
    user,
    selectedAppointmentTime,
    scrollSlide,
}: BookingFormProps) {
    const router = useRouter();
    const formSchema = BookingSchema((key) => t(`erros.${key}`));
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
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user) return;
        const tempPsychologistValues = {
            ...values,
            selectedDate: selectedAppointmentTime!,
            clientUid: user!.uid!,
            psychologistUid: profile?.uid!,
            new: true,
        };
        const tempUserValues = {
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
            });
            toast({
                title: t("scheduledAppointment"),
                description: `${selectedAppointmentTime}`,
            });
            router.push("/search");
        } catch (error) {
            console.error("Error adding appointment: ", error);
        }
    };
    return (
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
                            <FormLabel>{t("name.label")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("name.placeholder")}
                                    {...field}
                                    className=" border-2 border-[#52B788]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex w-full items-end justify-center gap-2">
                    <div className="w-full">
                        <FormLabel>{t("phone.label")}</FormLabel>
                        <div className="flex items-center justify-center rounded-full border-2 border-[#52B788] px-2">
                            <img
                                src="/logic/bg.png"
                                className="h-8"
                                alt="Bulgaria flag"
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="w-full ">
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "phone.placeholder",
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
                                    onValueChange={field.onChange}
                                    defaultValue={`${field.value}`}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full  border-2 border-[#52B788] text-xl">
                                            <SelectValue
                                                placeholder={t(
                                                    "age.placeholder",
                                                )}
                                                defaultValue={field.value}
                                            />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                {t("age.label")}
                                            </SelectLabel>
                                            {Array.from({
                                                length: 100,
                                            }).map((_, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={`${index + 14}`}
                                                >
                                                    {index + 14}
                                                </SelectItem>
                                            ))}
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
                            <FormLabel>{t("email.label")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("email.placeholder")}
                                    {...field}
                                    className=" border-2 border-[#52B788] "
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
                                onValueChange={field.onChange}
                                defaultValue={`${field.value}`}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full border-2 border-[#52B788] text-xl">
                                        <SelectValue
                                            placeholder={t(
                                                "session.placeholder",
                                            )}
                                            defaultValue={field.value}
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>
                                            {t("session.label")}
                                        </SelectLabel>
                                        <SelectItem value="You">
                                            {t("session.options.you")}
                                        </SelectItem>
                                        <SelectItem value="Couple">
                                            {t("session.options.couples")}
                                        </SelectItem>
                                        <SelectItem value="Family">
                                            {t("session.options.families")}
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
                            <FormLabel>{t("info.label")}</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={t("info.placeholder")}
                                    {...field}
                                    className="border-2 border-dashed border-[#52B788]"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex w-full justify-between gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-2 border-[#52B788] text-xl text-[#52B788]"
                        onClick={() => scrollSlide(0)}
                    >
                        {t("previous")}
                    </Button>
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-full border-2 bg-[#52B788] text-xl text-white transition-all hover:scale-110 hover:bg-[#3e8b67] hover:text-white"
                    >
                        {t("submit")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
