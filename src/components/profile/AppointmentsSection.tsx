import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ProfileT } from "@/models/profile";
import { UserType } from "@/models/user";
import { useState } from "react";
import AppointmentsList from "./AppointmentsList";
import ArticlesList from "./ArticlesList";
import ChatDialog from "./ChatDialog";
import { NewMessageIndicator, NewSessionIndicator } from "./Indicators";
import SessionsList from "./SessionsList";

interface AppointmentsSectionProps {
    user: UserType;
    profile: ProfileT;
    t: (args: string) => string;
}

export default function AppointmentsSection({
    user,
    profile,
    t,
}: AppointmentsSectionProps) {
    const [chatProps, setChatProps] = useState({
        senderUid: "",
        receiverUid: "",
        receiverUsername: "",
    });

    return (
        <div
            className={cn(
                "row-start-3 flex max-h-screen flex-1 flex-col justify-between gap-6 bg-[#FEFFEC] px-2 py-4 drop-shadow-lg transition duration-500 hover:drop-shadow-lg md:col-span-5 md:row-start-2 md:px-6 md:drop-shadow-[10px_10px_0_rgba(64,145,108,0.4)] xl:col-span-3 xl:col-start-6 xl:row-start-1",
                user.role !== "psychologist" && "max-w-3xl",
            )}
        >
            <h3 className="font-playfairDSC text-3xl text-[#40916C] lg:text-5xl">
                {t("bookings")}
            </h3>
            <Accordion
                type="single"
                collapsible
                className="h-fit w-full self-center overflow-y-auto"
            >
                <AccordionItem
                    value="appointments"
                    className="border-b-2 border-b-[#25BA9E]"
                >
                    <AccordionTrigger>
                        <div className="flex items-center gap-1">
                            <h4>{t("appointments.title")}</h4>
                            {user.appointments &&
                                user.appointments.length > 0 && (
                                    <>
                                        {user.appointments.some(
                                            (appointment) => appointment.new,
                                        ) && <NewSessionIndicator />}
                                        {(() => {
                                            const appointmentWithPsychologistUid =
                                                user.appointments.find(
                                                    (appointment) =>
                                                        appointment.psychologistUid,
                                                );
                                            return (
                                                appointmentWithPsychologistUid?.psychologistUid &&
                                                user.uid && (
                                                    <NewMessageIndicator
                                                        key="new-message-indicator"
                                                        senderUid={user.uid}
                                                        receiverUid={
                                                            appointmentWithPsychologistUid.psychologistUid
                                                        }
                                                    />
                                                )
                                            );
                                        })()}
                                    </>
                                )}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <AppointmentsList
                            user={user}
                            setChatProps={setChatProps}
                            t={(key) => t(`appointments.${key}`)}
                        />
                    </AccordionContent>
                </AccordionItem>
                {user.role === "psychologist" && (
                    <AccordionItem
                        value="sessions"
                        className="border-b-2 border-b-[#25BA9E]"
                    >
                        <AccordionTrigger>
                            <div className="flex items-center gap-1">
                                <h4>{t("sessions.title")}</h4>
                                {profile.appointments &&
                                    profile.appointments.length > 0 && (
                                        <>
                                            {profile.appointments.some(
                                                (appointment) =>
                                                    appointment.new,
                                            ) && <NewSessionIndicator />}
                                            {(() => {
                                                const appointmentWithClientUid =
                                                    profile.appointments.find(
                                                        (appointment) =>
                                                            appointment.clientUid,
                                                    );
                                                return (
                                                    appointmentWithClientUid?.clientUid &&
                                                    user.uid && (
                                                        <NewMessageIndicator
                                                            senderUid={user.uid}
                                                            receiverUid={
                                                                appointmentWithClientUid.clientUid
                                                            }
                                                        />
                                                    )
                                                );
                                            })()}
                                        </>
                                    )}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <SessionsList
                                profile={profile}
                                setChatProps={setChatProps}
                                t={(key) => t(`sessions.${key}`)}
                            />
                        </AccordionContent>
                    </AccordionItem>
                )}
                {(user.admin || user.role === "psychologist") && (
                    <AccordionItem
                        value="articles"
                        className="border-b-2 border-b-[#25BA9E]"
                    >
                        <AccordionTrigger>
                            {t("articles.title")}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ArticlesList
                                t={(key) => t(`articles.${key}`)}
                                uid={user.uid!}
                            />
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
            <hr className="col-span-2 w-full rounded-full border-2 border-[#40916C]" />
            {chatProps.senderUid !== "" && (
                <ChatDialog
                    chatProps={chatProps}
                    setChatProps={setChatProps}
                    userRole={user.role || ""}
                    t={(key) => t(`chat.${key}`)}
                />
            )}
        </div>
    );
}
