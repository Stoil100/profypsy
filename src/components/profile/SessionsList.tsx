import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ProfileT } from "@/models/profile";
import AppointmentDetails from "./AppointmentDetails";
import { NewMessageIndicator, NewSessionIndicator } from "./Indicators";
import { markSession } from "./utils";

interface SessionsListProps {
    profile: ProfileT;
    setChatProps: (props: {
        senderUid: string;
        receiverUid: string;
        receiverUsername: string;
    }) => void;
    t: (args: string) => string;
}

export default function SessionsList({
    profile,
    setChatProps,
    t,
}: SessionsListProps) {
    return (
        <Accordion
            type="single"
            collapsible
            className="rounded-2xl border-2 border-[#40916C] bg-[#FCFBF4] p-2 md:p-4"
        >
            {profile.appointments && profile.appointments.length > 0 ? (
                profile.appointments.map((appointment, index) => (
                    <AccordionItem
                        value={`item-${index}`}
                        key={index}
                        className="border-b-2 border-[#40916C]"
                    >
                        <AccordionTrigger
                            className="relative"
                            onClick={() => {
                                markSession(
                                    "psychologists",
                                    profile.uid,
                                    index,
                                );
                            }}
                        >
                            <div className="flex items-center gap-1">
                                {appointment.selectedDate}
                                {appointment.new && <NewSessionIndicator />}
                                <NewMessageIndicator
                                    senderUid={profile.uid}
                                    receiverUid={appointment.clientUid}
                                />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="md:p-4">
                            <AppointmentDetails
                                t={t}
                                appointment={appointment}
                                bookingType="session"
                                onChatClick={() => {
                                    setChatProps({
                                        senderUid: profile.uid,
                                        receiverUid: appointment.clientUid,
                                        receiverUsername: appointment.userName,
                                    });
                                }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                ))
            ) : (
                <div>{t("noUpcomingSessions")}</div>
            )}
        </Accordion>
    );
}
