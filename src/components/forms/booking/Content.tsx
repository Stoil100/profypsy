import { BookingSchema } from "@/components/schemas/booking";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { PsychologistT } from "@/models/psychologist";
import type { UserType } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AgeField } from "./AgeField";
import { EmailField } from "./EmailField";
import { InfoField } from "./InfoField";
import { NameField } from "./NameField";
import { PhoneField } from "./PhoneField";
import { SessionField } from "./SessionField";
import { updateAppointment } from "./utils";

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
    const formSchema = BookingSchema((key) => t(`errors.${key}`));
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            userName: user.userName!,
            phone: user.phone! || "",
            email: user.email!,
            session: "",
            age: "18",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!user || !profile) return;

        const psychologistAppointment = {
            ...values,
            selectedDate: selectedAppointmentTime!,
            clientUid: user.uid!,
            psychologistUid: profile.uid!,
            new: true,
        };

        const userAppointment = {
            userName: profile.userName!,
            email: profile.email!,
            phone: profile.phone!,
            info: values.info!,
            session: values.session!,
            age: profile.age!,
            selectedDate: selectedAppointmentTime!,
            clientUid: user.uid!,
            psychologistUid: profile.uid!,
            new: true,
        };

        const success = await updateAppointment(
            profile.uid!,
            user.uid!,
            psychologistAppointment,
            userAppointment,
        );

        if (success) {
            router.push("/search");
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4 bg-white py-2"
            >
                <NameField form={form} t={(key) => t(`name.${key}`)} />
                <div className="flex w-full items-end justify-center gap-2">
                    <PhoneField form={form} t={(key) => t(`phone.${key}`)} />
                    <AgeField form={form} t={(key) => t(`age.${key}`)} />
                </div>
                <EmailField form={form} t={(key) => t(`email.${key}`)} />
                <SessionField form={form} t={(key) => t(`session.${key}`)} />
                <InfoField form={form} t={(key) => t(`info.${key}`)} />
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
