"use client";
import ChatInterface from "@/components/Chat";
import MainButton from "@/components/MainButton";
import { useAuth } from "@/components/Providers";
import ArticlesSchema, { ArticleT } from "@/components/forms/article";
import EditForm from "@/components/forms/edit";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/firebase/config";
import { cn } from "@/lib/utils";
import { AppointmentT } from "@/models/appointment";
import { PsychologistT } from "@/models/psychologist";
import { Dialog } from "@radix-ui/react-dialog";
import {
    FirestoreError,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import {
    Calendar,
    CalendarPlusIcon,
    LanguagesIcon,
    Mail,
    MailIcon,
    MailWarningIcon,
    MapPinIcon,
    Phone,
    PhoneIcon,
    Trash2Icon,
    User,
    UserPenIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type ProfileT = PsychologistT & AppointmentT;

type MessageIndicatorProps = {
    senderUid: string;
    receiverUid: string;
};

const NewMessageIndicator: React.FC<MessageIndicatorProps> = ({
    senderUid,
    receiverUid,
}) => {
    const [newMessages, setNewMessages] = useState(false);
    useEffect(() => {
        function checkForUnreadMessages() {
            const conversationId =
                senderUid < receiverUid
                    ? `${senderUid}_${receiverUid}`
                    : `${receiverUid}_${senderUid}`;
            const messagesRef = collection(
                db,
                "conversations",
                conversationId,
                "messages",
            );
            const q = query(
                messagesRef,
                where("senderUid", "==", receiverUid),
                where("read", "==", false),
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const hasUnread = querySnapshot.size > 0;
                setNewMessages(hasUnread); // Update state based on presence of unread messages
            });
            return unsubscribe;
        }
        const unsubscribe = checkForUnreadMessages();
        return () => unsubscribe();
    }, [senderUid, receiverUid]);
    return (
        newMessages && (
            <div className="flex size-4 items-center justify-center rounded-full bg-orange-400">
                <MailWarningIcon className="size-3 text-white" />
            </div>
        )
    );
};
const NewSessionIndicator: React.FC = () => (
    <div className="flex size-4 items-center justify-center rounded-full bg-yellow-400">
        <CalendarPlusIcon className="size-3 text-white" />
    </div>
);
export default function Page() {
    const t = useTranslations("Profile");
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileT>();
    const [articles, setArticles] = useState<ArticleT[]>();
    const [chatProps, setChatProps] = useState({
        senderUid: "",
        receiverUid: "",
        receiverUsername: "",
    });
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    // const [hasNewMessages, setHasNewMessages] = useState(false);
    useEffect(() => {
        if (!user?.uid) {
            router.push("/login");
        }
    }, [user, router]);
    useEffect(() => {
        if (!user.uid) return;

        const unsubscribe = onSnapshot(
            doc(db, "users", user.uid),
            (docSnap) => {
                if (!docSnap.exists()) {
                    console.log("User not found");
                    return;
                }
                if (user.role === "psychologist") {
                    const psychologistRef = doc(
                        db,
                        "psychologists",
                        user?.uid!,
                    );
                    return onSnapshot(
                        psychologistRef,
                        (docSnapPsychologist) => {
                            if (docSnapPsychologist.exists()) {
                                setProfile(
                                    docSnapPsychologist.data() as ProfileT,
                                );
                            } else {
                                console.log("Psychologist profile not found");
                            }
                        },
                        (error: FirestoreError) => {
                            console.error(error.message);
                        },
                    );
                } else {
                    setProfile(docSnap.data() as ProfileT);
                }
            },
            (error: FirestoreError) => {
                console.error(error.message);
            },
        );

        return () => unsubscribe();
    }, [user.uid, user.role]);
    useEffect(() => {
        function fetchItems() {
            const q = query(
                collection(db, "articles"),
                where("creator", "==", user.uid),
            );
            const unsubscribe = onSnapshot(
                q,
                (querySnapshot) => {
                    const tempValues: ArticleT[] = [];
                    querySnapshot.forEach((doc) => {
                        tempValues.push(doc.data() as ArticleT);
                    });
                    setArticles(tempValues);
                },
                (error) => {
                    console.error("Error fetching items: ", error);
                },
            );

            return unsubscribe;
        }
        fetchItems();
    }, []);
    const markSession = async (
        col: "users" | "psychologists",
        uid: string,
        index: number,
    ) => {
        const documentRef = doc(db, col, uid);

        try {
            const docSnap = await getDoc(documentRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const appointments = data.appointments as AppointmentT[];

                // Update the 'new' property of the specific appointment
                appointments[index].new = false;

                // Update the entire array in Firestore
                await updateDoc(documentRef, {
                    appointments: appointments,
                });
                console.log("Array updated successfully!");
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };
    function toggleChat(
        senderUid: string,
        receiverUid: string,
        receiverUsername: string,
    ) {
        setChatProps({ senderUid, receiverUid, receiverUsername });
    }
    async function deleteArticle(id: number) {
        await deleteDoc(doc(db, "articles", `${id}`));
    }
    return (
        <main
            className={cn(
                "flex h-max min-h-[calc(100vh-(1rem+40px))] items-center justify-center bg-[#adebb3] py-4 pt-8",
            )}
        >
            {user.uid && profile! && (
                <div
                    className={cn(
                        "grid w-full grid-cols-1 grid-rows-3 gap-6 px-2 md:grid-cols-5 md:grid-rows-2 md:px-6 xl:grid-cols-8 xl:grid-rows-1",
                        user.role !== "psychologist" &&
                            "flex flex-wrap justify-center",
                    )}
                >
                    <div
                        className={cn(
                            "relative  flex max-h-[calc(100vh-(4rem+40px))] w-full flex-col items-center justify-between gap-8  bg-[#FEFFEC] px-2 py-4 drop-shadow-lg transition duration-500 hover:drop-shadow-lg md:col-span-2  md:px-6 md:drop-shadow-[10px_10px_0_rgba(64,145,108,0.4)]",
                            user.role !== "psychologist" && "w-full md:w-fit",
                        )}
                    >
                        {profile.variant! && (
                            <Dialog onOpenChange={setIsEditing}>
                                <DialogTrigger asChild>
                                    <MainButton className="absolute left-2 top-2 z-10 cursor-pointer border-2 border-[#25BA9E] px-1 py-1">
                                        <UserPenIcon />
                                    </MainButton>
                                </DialogTrigger>
                                <DialogContent className="mt-8 max-h-[90vh] max-w-3xl overflow-y-scroll">
                                    <EditForm
                                        profile={profile}
                                        setIsEditing={setIsEditing}
                                    />
                                </DialogContent>
                            </Dialog>
                        )}
                        <div className="relative flex h-fit w-full flex-col items-center justify-center gap-1  text-center">
                            {profile!.image ? (
                                <img
                                    src={profile!.image!}
                                    className="aspect-square w-full max-w-72 rounded-full border-4 border-[#25BA9E] p-1 shadow-xl"
                                />
                            ) : (
                                <div className="max-w-72 rounded-full border-2 p-4">
                                    <User size={42} />
                                </div>
                            )}
                            {profile!.variant && (
                                <div className="mt-1 flex items-center gap-4">
                                    <Badge
                                        className={cn(
                                            profile!.variant === "Deluxe"
                                                ? "bg-[#FCD96A]"
                                                : profile!.variant === "Premium"
                                                  ? "bg-[#FC8A6A]"
                                                  : profile!.variant === "Basic"
                                                    ? "bg-[#99B6ED]"
                                                    : "border-none bg-gradient-to-b from-[#F7F4E0] to-[#F1ECCC] text-black",
                                        )}
                                    >
                                        {profile!.variant}
                                    </Badge>
                                </div>
                            )}
                            {profile!.userName && (
                                <h2 className="text-3xl text-[#205041] ">
                                    {profile!.userName}
                                </h2>
                            )}
                            {profile!.quote && (
                                <p className="italic text-gray-500">
                                    &quot;{profile!.quote}&quot;
                                </p>
                            )}
                        </div>
                        <div className="grid w-full grid-cols-2 grid-rows-3 gap-2 text-white">
                            <div className="col-span-2 flex items-center justify-between gap-2 rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1">
                                <MailIcon />
                                <p>
                                    {user.email}{" "}
                                    {user.email !== profile!.email &&
                                        profile!.email}
                                </p>
                            </div>

                            <div className=" row-start-2 flex items-center justify-between rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1 ">
                                <MapPinIcon />
                                <p>{profile!.location}</p>
                            </div>
                            <div className="row-start-2 flex items-center justify-between rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1  ">
                                <PhoneIcon size={20} />
                                <p>
                                    {user.phone !== profile!.phone &&
                                        profile!.phone}
                                </p>
                            </div>
                            <div className="row-start-3  flex items-center justify-between rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1 ">
                                <p>{t("age")}:</p>
                                <p>{profile!.age}</p>
                            </div>
                            <div className="row-start-3 flex items-center justify-between rounded-lg border-2 border-[#40916C] bg-[#52B788] px-2 py-1">
                                <LanguagesIcon />
                                <div className="flex gap-2">
                                    {profile!.languages?.map(
                                        (language, index) => (
                                            <Badge
                                                className="w-fit border-2 border-[#40916C] bg-[#F1ECCC] p-[2px] text-xl"
                                                key={index}
                                            >
                                                <img
                                                    src={
                                                        language === "Bulgarian"
                                                            ? "/logic/bg.png"
                                                            : language ===
                                                                "Български"
                                                              ? "/logic/bg.png"
                                                              : "/logic/en.png"
                                                    }
                                                    alt={language}
                                                    className="w-6"
                                                />
                                            </Badge>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {user.role === "psychologist" && (
                        <div className="row-start-2 flex max-h-[calc(100vh-(4rem+40px))] w-full flex-col justify-between gap-4 md:col-span-3 md:!col-start-3 md:row-start-1 xl:col-span-3 ">
                            <div className="flex h-full w-full flex-1 flex-col justify-between gap-4 overflow-y-auto bg-[#FEFFEC] px-2 py-4  drop-shadow-lg transition duration-500 hover:drop-shadow-lg md:px-6 md:drop-shadow-[10px_10px_0_rgba(64,145,108,0.4)]">
                                <h3 className="font-playfairDSC text-3xl text-[#40916C] lg:text-5xl">
                                    {t("overview")}
                                </h3>
                                <div>
                                    <p>{t("about")}:</p>
                                    <p className="w-full break-all rounded-2xl border-2 border-dashed border-black p-2 text-center">
                                        {profile!.about}
                                    </p>
                                </div>
                                {profile!.specializations && (
                                    <div>
                                        <p>{t("specializations")}:</p>
                                        <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black p-2">
                                            {profile!.specializations.map(
                                                (specialization) => (
                                                    <p
                                                        key={specialization}
                                                        className="rounded-xl bg-[#25BA9E] px-4 py-1 text-white"
                                                    >
                                                        {specialization}
                                                    </p>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex h-full w-full flex-1 flex-col justify-between gap-4 overflow-y-auto bg-[#FEFFEC] px-2 py-4  drop-shadow-lg transition duration-500 hover:drop-shadow-lg md:px-6 md:drop-shadow-[10px_10px_0_rgba(64,145,108,0.4)]">
                                <h3 className="font-playfairDSC text-3xl text-[#40916C] lg:text-5xl">
                                    {t("background")}
                                </h3>
                                {profile!.educations && (
                                    <div>
                                        <p>{t("education")}:</p>
                                        <div className="flex w-full flex-wrap items-center justify-center gap-2 break-all rounded-2xl border-2 border-dashed border-black p-2">
                                            {profile!.educations.map(
                                                (education) => (
                                                    <p
                                                        key={
                                                            education.education
                                                        }
                                                        className="rounded-xl bg-[#25BA9E] px-4 py-1 text-white"
                                                    >
                                                        {education.education}
                                                    </p>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                                {profile!.experiences && (
                                    <div>
                                        <p>{t("experience")}:</p>
                                        <div className="flex w-full flex-wrap items-center justify-center gap-2 break-all rounded-2xl border-2 border-dashed border-black p-2">
                                            {profile!.experiences.map(
                                                (experience) => (
                                                    <p
                                                        key={
                                                            experience.experience
                                                        }
                                                        className="rounded-xl bg-[#25BA9E] px-4 py-1 text-white"
                                                    >
                                                        {experience.experience}
                                                    </p>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div
                        className={cn(
                            "row-start-3 flex max-h-[calc(100vh-(4rem+40px))] flex-1 flex-col justify-between gap-6 bg-[#FEFFEC] px-2 py-4  drop-shadow-lg transition duration-500 hover:drop-shadow-lg md:col-span-5 md:row-start-2 md:px-6 md:drop-shadow-[10px_10px_0_rgba(64,145,108,0.4)] xl:col-span-3 xl:col-start-6 xl:row-start-1",
                            user.role !== "psychologist" && "max-w-3xl",
                        )}
                    >
                        <h3 className="font-playfairDSC text-5xl text-[#40916C]">
                            {t("bookings")}
                        </h3>
                        <Accordion
                            type="single"
                            collapsible
                            className="h-fit w-full self-center overflow-y-auto "
                        >
                            <AccordionItem
                                value="item-1"
                                className="border-b-2 border-b-[#25BA9E]"
                            >
                                <AccordionTrigger>
                                    <div className="flex items-center gap-1">
                                        <h4>{t("appointments")}</h4>
                                        {user!.appointments &&
                                            user!.appointments.length > 0 && (
                                                <>
                                                    {user.appointments.some(
                                                        (appointment) =>
                                                            appointment.new,
                                                    ) && (
                                                        <NewSessionIndicator />
                                                    )}
                                                    {(() => {
                                                        const appointmentWithPsychologistUid =
                                                            user.appointments.find(
                                                                (appointment) =>
                                                                    appointment.psychologistUid,
                                                            );
                                                        return (
                                                            appointmentWithPsychologistUid?.psychologistUid && (
                                                                <NewMessageIndicator
                                                                    key="new-message-indicator"
                                                                    senderUid={
                                                                        user.uid!
                                                                    }
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
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="rounded-2xl border-2 border-[#40916C] bg-[#FCFBF4] p-4"
                                    >
                                        {user!.appointments &&
                                        user!.appointments.length > 0 ? (
                                            user.appointments.map(
                                                (appointment, index) => (
                                                    <AccordionItem
                                                        value={`item-${index}`}
                                                        key={index}
                                                        className="border-b-2 border-[#40916C]"
                                                    >
                                                        <AccordionTrigger
                                                            className="relative"
                                                            onClick={() => {
                                                                markSession(
                                                                    "users",
                                                                    user?.uid!,
                                                                    index,
                                                                );
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-1">
                                                                <p>
                                                                    {
                                                                        appointment.selectedDate
                                                                    }
                                                                </p>
                                                                {appointment.new && (
                                                                    <NewSessionIndicator />
                                                                )}
                                                                <NewMessageIndicator
                                                                    senderUid={
                                                                        user.uid!
                                                                    }
                                                                    receiverUid={
                                                                        appointment.psychologistUid
                                                                    }
                                                                />
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="p-4">
                                                            <div className="space-y-4 break-all">
                                                                <div>
                                                                    <h3 className="flex items-center space-x-2 text-lg font-semibold">
                                                                        <User className="h-5 w-5" />
                                                                        <span>
                                                                            {t(
                                                                                "psychologistInfo",
                                                                            )}
                                                                        </span>
                                                                    </h3>
                                                                    <div className="pl-8">
                                                                        <h4 className="text-md text-2xl font-medium">
                                                                            {
                                                                                appointment.userName
                                                                            }
                                                                        </h4>
                                                                    </div>
                                                                    <div className="space-y-2 pl-8">
                                                                        <p className="flex items-center text-xl">
                                                                            <Mail className="mr-2 h-4 w-4" />
                                                                            {
                                                                                appointment.email
                                                                            }
                                                                        </p>
                                                                        <p className="flex items-center text-xl">
                                                                            <Phone className="mr-2 h-4 w-4" />
                                                                            {
                                                                                appointment.phone
                                                                            }
                                                                        </p>
                                                                        <p className="text-xl">
                                                                            {t(
                                                                                "age",
                                                                            )}
                                                                            :{" "}
                                                                            {
                                                                                appointment.age
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="flex items-center space-x-2 text-lg font-semibold">
                                                                        <Calendar className="h-5 w-5" />
                                                                        <span>
                                                                            {t(
                                                                                "appointmentInfo",
                                                                            )}
                                                                        </span>
                                                                    </h3>
                                                                    <div className="px-8">
                                                                        <div>
                                                                            <p>
                                                                                {t(
                                                                                    "info",
                                                                                )}
                                                                            </p>
                                                                            <p className="rounded-xl border-2 border-dashed p-2 text-center text-xl">
                                                                                {
                                                                                    appointment.info
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex flex-col gap-2">
                                                                            <p>
                                                                                {t(
                                                                                    "sessionType",
                                                                                )}
                                                                            </p>
                                                                            <h4 className="w-fit self-center rounded-full border-2 px-2 text-center text-xl">
                                                                                {
                                                                                    appointment.session
                                                                                }
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <MainButton
                                                                    className="w-full border-2 border-[#25BA9E] text-xl hover:scale-105"
                                                                    onClick={() => {
                                                                        toggleChat(
                                                                            user.uid!,
                                                                            appointment.psychologistUid,
                                                                            appointment.userName,
                                                                        );
                                                                    }}
                                                                >
                                                                    <NewMessageIndicator
                                                                        senderUid={
                                                                            user.uid!
                                                                        }
                                                                        receiverUid={
                                                                            appointment.psychologistUid
                                                                        }
                                                                    />
                                                                    {t(
                                                                        "chatNow",
                                                                    )}
                                                                </MainButton>
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ),
                                            )
                                        ) : (
                                            <p>
                                                {t("noAppointments")} <br />
                                                {t("bookOneHere")}{" "}
                                                <Link
                                                    href={"/search"}
                                                    className="text-[#25BA9E] underline"
                                                >
                                                    here
                                                </Link>
                                            </p>
                                        )}
                                    </Accordion>
                                    {chatProps.senderUid !== "" && (
                                        <Dialog
                                            open={chatProps.senderUid !== ""}
                                            onOpenChange={() => {
                                                setChatProps({
                                                    senderUid: "",
                                                    receiverUid: "",
                                                    receiverUsername: "",
                                                });
                                            }}
                                        >
                                            <DialogContent
                                                className={cn(
                                                    " max-w-[550px] bg-gradient-to-b",
                                                    user.role === "psychologist"
                                                        ? "from-[#40916C] to-[#52B788]"
                                                        : "from-[#F7F4E0] to-[#F1ECCC]",
                                                )}
                                            >
                                                <ChatInterface
                                                    senderUid={
                                                        chatProps.senderUid
                                                    }
                                                    receiverUid={
                                                        chatProps.receiverUid
                                                    }
                                                    receiverUsername={
                                                        chatProps.receiverUsername
                                                    }
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                            {user.role === "psychologist" && (
                                <>
                                    <AccordionItem
                                        value="item-2"
                                        className="border-b-2 border-b-[#25BA9E]"
                                    >
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-1">
                                                <h4>{t("sessions")}</h4>
                                                {profile!.appointments &&
                                                    profile!.appointments
                                                        .length > 0 && (
                                                        <>
                                                            {profile.appointments.some(
                                                                (appointment) =>
                                                                    appointment.new,
                                                            ) && (
                                                                <NewSessionIndicator />
                                                            )}
                                                            {(() => {
                                                                const appointmentWithClientUid =
                                                                    profile.appointments.find(
                                                                        (
                                                                            appointment,
                                                                        ) =>
                                                                            appointment.clientUid,
                                                                    );
                                                                return (
                                                                    appointmentWithClientUid?.clientUid && (
                                                                        <NewMessageIndicator
                                                                            senderUid={
                                                                                user.uid!
                                                                            }
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
                                            <Accordion
                                                type="single"
                                                collapsible
                                                className="rounded-2xl border-2 border-[#40916C] bg-[#FCFBF4] p-4 "
                                            >
                                                {profile!.appointments.length >
                                                0 ? (
                                                    profile!.appointments.map(
                                                        (
                                                            appointment,
                                                            index,
                                                        ) => (
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
                                                                        {
                                                                            appointment.selectedDate
                                                                        }
                                                                        {appointment.new && (
                                                                            <NewSessionIndicator />
                                                                        )}
                                                                        <NewMessageIndicator
                                                                            senderUid={
                                                                                user.uid!
                                                                            }
                                                                            receiverUid={
                                                                                appointment.clientUid
                                                                            }
                                                                        />
                                                                    </div>
                                                                </AccordionTrigger>
                                                                <AccordionContent className="p-4 ">
                                                                    <div className="space-y-4 break-all">
                                                                        <div>
                                                                            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                                                                                <User className="h-5 w-5" />
                                                                                <span>
                                                                                    {t(
                                                                                        "clientInfo",
                                                                                    )}
                                                                                </span>
                                                                            </h3>
                                                                            <div className="pl-8">
                                                                                <h4 className="text-md text-2xl font-medium">
                                                                                    {
                                                                                        appointment.userName
                                                                                    }
                                                                                </h4>
                                                                            </div>
                                                                            <div className="space-y-2 pl-8">
                                                                                <p className="flex items-center text-xl">
                                                                                    <Mail className="mr-2 h-4 w-4" />
                                                                                    {
                                                                                        appointment.email
                                                                                    }
                                                                                </p>
                                                                                <p className="flex items-center text-xl">
                                                                                    <Phone className="mr-2 h-4 w-4" />
                                                                                    {
                                                                                        appointment.phone
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xl">
                                                                                    {t(
                                                                                        "age",
                                                                                    )}

                                                                                    :{" "}
                                                                                    {
                                                                                        appointment.age
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                                                                                <Calendar className="h-5 w-5" />
                                                                                <span>
                                                                                    {t(
                                                                                        "appointmentInfo",
                                                                                    )}
                                                                                </span>
                                                                            </h3>
                                                                            <div className="px-8">
                                                                                <div>
                                                                                    <p>
                                                                                        {t(
                                                                                            "info",
                                                                                        )}
                                                                                    </p>
                                                                                    <p className="rounded-xl border-2 border-dashed p-2 text-center text-xl">
                                                                                        {
                                                                                            appointment.info
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-col gap-2">
                                                                                    <p>
                                                                                        {t(
                                                                                            "sessionType",
                                                                                        )}
                                                                                    </p>
                                                                                    <h4 className="w-fit self-center rounded-full border-2 px-2 text-center text-xl">
                                                                                        {
                                                                                            appointment.session
                                                                                        }
                                                                                    </h4>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <MainButton
                                                                            className="w-full border-2 border-[#25BA9E] text-xl hover:scale-105"
                                                                            onClick={() => {
                                                                                toggleChat(
                                                                                    user.uid!,
                                                                                    appointment.clientUid,
                                                                                    appointment.userName,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <NewMessageIndicator
                                                                                senderUid={
                                                                                    user.uid!
                                                                                }
                                                                                receiverUid={
                                                                                    appointment.clientUid
                                                                                }
                                                                            />
                                                                            {t(
                                                                                "chatNow",
                                                                            )}
                                                                        </MainButton>
                                                                    </div>
                                                                </AccordionContent>
                                                            </AccordionItem>
                                                        ),
                                                    )
                                                ) : (
                                                    <div>
                                                        {t(
                                                            "noUpcomingSessions",
                                                        )}
                                                    </div>
                                                )}
                                                {chatProps.senderUid !== "" && (
                                                    <Dialog
                                                        open={
                                                            chatProps.senderUid !==
                                                            ""
                                                        }
                                                        onOpenChange={() => {
                                                            setChatProps({
                                                                senderUid: "",
                                                                receiverUid: "",
                                                                receiverUsername:
                                                                    "",
                                                            });
                                                        }}
                                                    >
                                                        <DialogContent
                                                            className={cn(
                                                                "max-w-[550px] bg-gradient-to-b",
                                                                user.role ===
                                                                    "psychologist"
                                                                    ? "from-[#40916C] to-[#52B788]"
                                                                    : "from-[#F7F4E0] to-[#F1ECCC]",
                                                            )}
                                                        >
                                                            <ChatInterface
                                                                senderUid={
                                                                    chatProps.senderUid
                                                                }
                                                                receiverUid={
                                                                    chatProps.receiverUid
                                                                }
                                                                receiverUsername={
                                                                    chatProps.receiverUsername
                                                                }
                                                            />
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                            </Accordion>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem
                                        value="item-3"
                                        className="border-b-2 border-b-[#25BA9E]"
                                    >
                                        <AccordionTrigger>
                                            {t("articles")}
                                        </AccordionTrigger>
                                        <AccordionContent className="flex flex-col pr-1">
                                            {articles && articles.length > 0 ? (
                                                articles.map(
                                                    (article, index) => (
                                                        <div
                                                            key={index}
                                                            className="w-full space-y-3 rounded-md border-2 border-dashed border-black p-2"
                                                        >
                                                            <img
                                                                src={
                                                                    article.image
                                                                }
                                                                alt={
                                                                    article.title
                                                                }
                                                            />
                                                            <h3 className="text-2xl">
                                                                {article.title}
                                                            </h3>
                                                            <MainButton
                                                                onClick={() => {
                                                                    deleteArticle(
                                                                        article.id!,
                                                                    );
                                                                }}
                                                                className="border-2 border-red-500 text-red-500"
                                                            >
                                                                <Trash2Icon />{" "}
                                                                {t(
                                                                    "deleteArticle",
                                                                )}
                                                            </MainButton>
                                                        </div>
                                                    ),
                                                )
                                            ) : (
                                                <h2 className="text-center text-xl">
                                                    {t("noArticlesCreated")}
                                                </h2>
                                            )}
                                            <Dialog>
                                                <DialogTrigger className="mt-4 w-[90%] self-center rounded-full border-2 border-[#25BA9E] px-2 py-1 text-center text-xl text-[#25BA9E] transition-transform hover:scale-105">
                                                    {t("uploadArticle")}
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl !rounded-3xl border-8 border-[#25BA9E] p-1">
                                                    <ScrollArea className="max-h-[70vh] w-full rounded-md border p-4">
                                                        <ArticlesSchema />
                                                    </ScrollArea>
                                                </DialogContent>
                                            </Dialog>
                                        </AccordionContent>
                                    </AccordionItem>
                                </>
                            )}
                        </Accordion>
                        <hr className="col-span-2 w-full rounded-full border-2 border-[#40916C]" />
                    </div>
                </div>
            )}
        </main>
    );
}
