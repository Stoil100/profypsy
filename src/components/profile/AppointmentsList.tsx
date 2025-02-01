import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import AppointmentDetails from "./AppointmentDetails";
import { NewMessageIndicator, NewSessionIndicator } from "./Indicators";
import { markSession } from "./utils";

interface AppointmentsListProps {
    profile: {
        uid: string;
        appointments?: any[];
    };
    setChatProps: (props: {
        senderUid: string;
        receiverUid: string;
        receiverUsername: string;
    }) => void;
    t: (args: string) => string;
}

export default function AppointmentsList({
    profile: user,
    setChatProps,
    t,
}: AppointmentsListProps) {
    return (
        <Accordion
            type="single"
            collapsible
            className="rounded-2xl border-2 border-[#40916C] bg-[#FCFBF4] p-4"
        >
            {user.appointments && user.appointments.length > 0 ? (
                user.appointments.map((appointment, index) => (
                    <AccordionItem
                        value={`item-${index}`}
                        key={index}
                        className="border-b-2 border-[#40916C]"
                    >
                        <AccordionTrigger
                            className="relative"
                            onClick={() => {
                                markSession("users", user.uid, index);
                            }}
                        >
                            <div className="flex items-center gap-1">
                                <p>{appointment.selectedDate}</p>
                                {appointment.new && <NewSessionIndicator />}
                                <NewMessageIndicator
                                    senderUid={user.uid}
                                    receiverUid={appointment.psychologistUid}
                                />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4">
                            <AppointmentDetails
                                t={(key) => t(`info.${key}`)}
                                appointment={appointment}
                                userRole="client"
                                onChatClick={() => {
                                    setChatProps({
                                        senderUid: user.uid,
                                        receiverUid:
                                            appointment.psychologistUid,
                                        receiverUsername: appointment.userName,
                                    });
                                }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                ))
            ) : (
                <p>
                    {t("noAppointments")} <br />
                    <Link href="/search" className="text-[#25BA9E] underline">
                        {t("bookOneHere")}
                    </Link>
                </p>
            )}
        </Accordion>
    );
}
