import MainButton from "@/components/MainButton";
import { AppointmentT } from "@/models/appointment";
import { Calendar, Mail, Phone, User } from "lucide-react";
import { NewMessageIndicator } from "./Indicators";

interface AppointmentDetailsProps {
    appointment: AppointmentT;
    bookingType: "session" | "appointment";
    onChatClick: () => void;
    t: (args: string) => string;
}

export default function AppointmentDetails({
    appointment,
    bookingType,
    onChatClick,
    t,
}: AppointmentDetailsProps) {
    return (
        <div className="space-y-4 break-all">
            <div>
                <h3 className="flex items-center space-x-2 text-lg font-semibold">
                    <User className="h-5 w-5" />
                    <span>
                        {bookingType === "session"
                            ? t("client")
                            : t("psychologist")}
                    </span>
                </h3>
                <div className="pl-8">
                    <h4 className="text-md text-2xl font-medium">
                        {appointment.userName}
                    </h4>
                </div>
                <div className="space-y-2 pl-8">
                    <p className="flex items-center text-xl">
                        <Mail className="mr-2 h-4 w-4" />
                        {appointment.email}
                    </p>
                    <p className="flex items-center text-xl">
                        <Phone className="mr-2 h-4 w-4" />
                        {appointment.phone}
                    </p>
                    <p className="text-xl">
                        {t("age")}: {appointment.age}
                    </p>
                </div>
            </div>
            <div>
                <h3 className="flex items-center space-x-2 text-lg font-semibold">
                    <Calendar className="h-5 w-5" />
                    <span>{t("appointment")}</span>
                </h3>
                <div className="px-8">
                    <div>
                        <p>{t("title")}</p>
                        <p className="rounded-xl border-2 border-dashed p-2 text-center text-xl">
                            {appointment.info}
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>{t("sessionType")}</p>
                        <h4 className="w-fit self-center rounded-full border-2 px-2 text-center text-xl">
                            {appointment.session}
                        </h4>
                    </div>
                </div>
            </div>
            <MainButton
                className="w-full gap-2 border-2 border-[#25BA9E] text-xl hover:scale-105"
                onClick={onChatClick}
            >
                <NewMessageIndicator
                    senderUid={
                        bookingType === "appointment"
                            ? appointment.clientUid!
                            : appointment.psychologistUid!
                    }
                    receiverUid={
                        bookingType === "session"
                            ? appointment.psychologistUid!
                            : appointment.clientUid!
                    }
                />
                {t("chatNow")}
            </MainButton>
        </div>
    );
}
