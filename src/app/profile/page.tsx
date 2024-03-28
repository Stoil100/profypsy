"use client";
// pages/profile!/[uid].tsx
import { AppointmentT } from "@/app/(logic)/search/[id]/page";
import ChatInterface from "@/components/Chat";
import GradientButton from "@/components/GradientButton";
import { useAuth } from "@/components/Providers";
import { PsychologistProfile } from "@/components/forms/appliance";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/firebase/config";
import { cn } from "@/lib/utils";
import { Dialog } from "@radix-ui/react-dialog";
import { doc, getDoc } from "firebase/firestore";
import {
    BellDot,
    Calendar,
    Mail,
    Phone,
    Settings,
    User
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileT = PsychologistProfile & AppointmentT;

export default function Page() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<ProfileT>();
    const [chatProps,setChatProps] = useState({senderUid:"",receiverUid:"",receiverUsername:{firstName:"",lastName:""}});
    const router = useRouter();
    useEffect(() => {
       if (!user?.uid) {
            router.push("/login");
        }
    }, [user, router]);
    useEffect(() => {
        async function getUserData() {
            const docRef = doc(db, "users", user.uid!);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                return {
                    notFound: true, // Return a 404 page if the user does not exist
                };
            }
            if (user.role === "psychologist") {
                const docRef = doc(db, "psychologists", user.uid!);
                const docSnapPsychologist = await getDoc(docRef);
                setProfile(docSnapPsychologist.data() as ProfileT);
            } else {
                setProfile(docSnap.data() as ProfileT);
            }
        }
        getUserData();
    }, []);

    function toggleChat(senderUid:string,receiverUid:string,receiverUsername:{firstName:string,lastName:string}){
        console.log(senderUid,receiverUid);
        setChatProps({senderUid,receiverUid,receiverUsername })
    }
    console.log(user);
    return (
        <main
            className={cn(
                "flex h-fit min-h-screen items-center justify-center bg-gradient-to-b py-4 pt-[10vh]",
                user.role === "psychologist"
                    ? "from-[#40916C] to-[#52B788]"
                    : "from-[#F7F4E0] to-[#F1ECCC]",
            )}
        >
            {user.uid && profile! && (
                <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-white p-4 sm:w-[600px]">
                    <h2 className="font-playfairDSC text-4xl font-bold ">
                        Profile
                    </h2>
                    <div className="flex items-center gap-2">
                        {profile!.image ? (
                            <img
                                src={profile!.image!}
                                className="size-32 rounded-full border-4 border-[#25BA9E] p-1 shadow-2xl"
                            />
                        ) : (
                            <div className="rounded-full border-2 p-4">
                                <User size={42} />
                            </div>
                        )}
                        <div>
                            {profile!.userName && (
                                <h2 className="text-3xl">
                                    {profile!.userName.firstName}{" "}
                                    {profile!.userName.lastName}
                                </h2>
                            )}
                            <p>
                                Your
                                {user.role === "psychologist" &&
                                    " psychologist"}{" "}
                                account
                            </p>
                            {profile!.variant && (
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
                            )}
                        </div>
                    </div>
                    <Tabs defaultValue="settings">
                        <TabsList className="w-full">
                            <TabsTrigger value="settings">
                                <Settings className="sm:mr-2" />
                                <p className="hidden sm:block">Account</p>
                            </TabsTrigger>
                            <TabsTrigger value="appointments">
                                <Calendar className="sm:mr-2" />
                                <p className="hidden sm:block">Appointments</p>
                            </TabsTrigger>
                            {user.role === "psychologist" && (
                                <TabsTrigger value="sessions">
                                    <BellDot className="sm:mr-2" />
                                    <p className="hidden sm:block">Sessions</p>
                                </TabsTrigger>
                            )}
                        </TabsList>
                        <TabsContent
                            value="settings"
                            className="w-full space-y-4 break-all"
                        >
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="h-full">
                                    <div className="flex items-center justify-between gap-2 rounded-lg bg-gray-100 p-2">
                                        <p>Email:</p>
                                        <p>
                                            {user.email}{" "}
                                            {user.email !== profile!.email &&
                                                profile!.email}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-100 p-2">
                                        <p>Age:</p>
                                        <p>{profile!.age}</p>
                                    </div>
                                </div>
                                <div className="h-full">
                                    <div className="flex items-center justify-between rounded-lg bg-gray-100 p-2">
                                        <p>Location:</p>
                                        <p>{profile!.location}</p>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between rounded-lg bg-gray-100 p-2">
                                        <p>Phone:</p>
                                        <p>{profile!.phone}</p>
                                    </div>
                                </div>
                                {user.role === "psychologist" && (
                                    <>
                                        <div className="col-span-1 rounded-xl bg-gray-100 p-2 md:col-span-2">
                                            <p>Languages:</p>
                                            <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-full border-2  border-dashed border-black p-2 ">
                                                {profile!.languages.map(
                                                    (language) => (
                                                        <p
                                                            key={language}
                                                            className="rounded-full bg-blue-100 px-4 py-1"
                                                        >
                                                            {language}
                                                        </p>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-1 rounded-xl bg-gray-100 p-2 md:col-span-2">
                                            <p>About:</p>
                                            <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-2xl border-2  border-dashed border-black p-2 ">
                                                <p>{profile!.about}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-1 rounded-xl bg-gray-100 p-2 md:col-span-2">
                                            <p>Quote:</p>
                                            <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-full border-2  border-dashed border-black p-2 ">
                                                <p className="italic text-center">
                                                    &quot;{profile!.quote}&quot;
                                                </p>
                                            </div>
                                        </div>
                                        {profile!.educations && (
                                            <div className="col-span-1 rounded-xl bg-gray-100 p-2 md:col-span-2">
                                                <p>Education:</p>
                                                <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-2xl border-2  border-dashed border-black p-2 ">
                                                    {profile!.educations.map(
                                                        (education) => (
                                                            <p
                                                                key={
                                                                    education.education
                                                                }
                                                                className="rounded-xl bg-blue-100 px-4 py-1"
                                                            >
                                                                {
                                                                    education.education
                                                                }
                                                            </p>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {profile!.experiences && (
                                            <div className="col-span-1 rounded-xl bg-gray-100 p-2 md:col-span-2">
                                                <p>Experience:</p>
                                                <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-2xl border-2  border-dashed border-black p-2 ">
                                                    {profile!.experiences.map(
                                                        (experience) => (
                                                            <p
                                                                key={
                                                                    experience.experience
                                                                }
                                                                className="rounded-xl bg-blue-100 px-4 py-1"
                                                            >
                                                                {
                                                                    experience.experience
                                                                }
                                                            </p>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {profile!.specializations && (
                                            <div className="col-span-1 rounded-xl bg-gray-100 p-2 md:col-span-2">
                                                <p>Specializations:</p>
                                                <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-full border-2  border-dashed border-black p-2 ">
                                                    {profile!.specializations.map(
                                                        (specialization) => (
                                                            <p
                                                                key={
                                                                    specialization
                                                                }
                                                                className="rounded-full bg-blue-100 px-4 py-1"
                                                            >
                                                                {specialization}
                                                            </p>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </TabsContent>
                        <TabsContent value="appointments">
                            <Accordion
                                type="single"
                                collapsible
                                className="rounded-2xl bg-[#FCFBF4] p-4"
                            >
                                {user!.appointments!.length! > 0 ? (
                                    user.appointments?.map(
                                        (appointment, index) => (
                                            <AccordionItem
                                                value={`item-${index}`}
                                                key={index}
                                            >
                                                <AccordionTrigger>
                                                    {appointment.selectedDate}
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4">
                                                    <div className="space-y-4 break-all">
                                                        <div>
                                                            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                                                                <User className="h-5 w-5" />{" "}
                                                                <span>
                                                                    Psychologist
                                                                    info:
                                                                </span>
                                                            </h3>
                                                            <div className="pl-8">
                                                                <h4 className="text-md text-2xl font-medium">
                                                                    {
                                                                        appointment
                                                                            .userName
                                                                            .firstName
                                                                    }{" "}
                                                                    {
                                                                        appointment
                                                                            .userName
                                                                            .lastName
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
                                                                    Age:{" "}
                                                                    {
                                                                        appointment.age
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                                                                <Calendar className="h-5 w-5" />{" "}
                                                                <span>
                                                                    Appointment
                                                                    info:
                                                                </span>
                                                            </h3>
                                                            <div className="px-8">
                                                                <div>
                                                                    <p className="">
                                                                        Info:
                                                                    </p>
                                                                    <p className="rounded-xl border-2 border-dashed p-2 text-center text-xl">
                                                                        {
                                                                            appointment.info
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <p>
                                                                        Session
                                                                        type:
                                                                    </p>
                                                                    <h4 className="w-fit self-center rounded-full border-2 px-2 text-center text-xl">
                                                                        {
                                                                            appointment.session
                                                                        }
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <GradientButton
                                                            className="w-full border-2 border-[#25BA9E] text-xl"
                                                            onClick={() => {
                                                                toggleChat(
                                                                    user.uid!,
                                                                    appointment!
                                                                        .psychologistUid,
                                                                    appointment.userName,
                                                                );
                                                            }}
                                                        >
                                                            Chat now
                                                        </GradientButton>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ),
                                    )
                                ) : (
                                    <p>
                                        You don&apos;t have any appointments at the
                                        moment. <br/> You can book one{" "}
                                        <Link href={"/search"} className="text-[#25BA9E] underline ">here</Link>
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
                                            receiverUsername: {
                                                lastName: "",
                                                firstName: "",
                                            },
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
                                            senderUid={chatProps.senderUid}
                                            receiverUid={chatProps.receiverUid}
                                            receiverUsername={
                                                chatProps.receiverUsername
                                            }
                                        />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </TabsContent>
                        <TabsContent value="sessions">
                            <Accordion
                                type="single"
                                collapsible
                                className="rounded-2xl bg-[#FCFBF4] p-4"
                            >
                                {profile!.appointments.length > 0 ? (
                                    profile!.appointments?.map(
                                        (appointment, index) => (
                                            <AccordionItem
                                                value={`item-${index}`}
                                                key={index}
                                            >
                                                <AccordionTrigger>
                                                    {appointment.selectedDate}
                                                </AccordionTrigger>
                                                <AccordionContent className="p-4">
                                                    <div className="space-y-4 break-all">
                                                        <div>
                                                            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                                                                <User className="h-5 w-5" />{" "}
                                                                <span>
                                                                    Client info:
                                                                </span>
                                                            </h3>
                                                            <div className="pl-8">
                                                                <h4 className="text-md text-2xl font-medium">
                                                                    {
                                                                        appointment
                                                                            .userName
                                                                            .firstName
                                                                    }{" "}
                                                                    {
                                                                        appointment
                                                                            .userName
                                                                            .lastName
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
                                                                    Age:{" "}
                                                                    {
                                                                        appointment.age
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="flex items-center space-x-2 text-lg font-semibold">
                                                                <Calendar className="h-5 w-5" />{" "}
                                                                <span>
                                                                    Appointment
                                                                    info:
                                                                </span>
                                                            </h3>
                                                            <div className="px-8">
                                                                <div>
                                                                    <p className="">
                                                                        Info:
                                                                    </p>
                                                                    <p className="rounded-xl border-2 border-dashed p-2 text-center text-xl">
                                                                        {
                                                                            appointment.info
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="flex flex-col gap-2">
                                                                    <p>
                                                                        Session
                                                                        type:
                                                                    </p>
                                                                    <h4 className="w-fit self-center rounded-full border-2 px-2 text-center text-xl">
                                                                        {
                                                                            appointment.session
                                                                        }
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <GradientButton
                                                            className="w-full border-2 border-[#25BA9E] text-xl"
                                                            onClick={() => {
                                                                toggleChat(
                                                                    user!.uid!,
                                                                    appointment.clientUid!,
                                                                    appointment.userName,
                                                                );
                                                            }}
                                                        >
                                                            Chat now
                                                        </GradientButton>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ),
                                    )
                                ) : (
                                    <div>
                                        You don&apos;t have any upcoming sessions
                                    </div>
                                )}
                            </Accordion>
                            {chatProps.senderUid !== "" && (
                                <Dialog
                                    open={chatProps.senderUid !== ""}
                                    onOpenChange={() => {
                                        setChatProps({
                                            senderUid: "",
                                            receiverUid: "",
                                            receiverUsername: {
                                                firstName: "",
                                                lastName: "",
                                            },
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
                                        {" "}
                                        <ChatInterface
                                            senderUid={chatProps.senderUid}
                                            receiverUid={chatProps.receiverUid}
                                            receiverUsername={
                                                chatProps.receiverUsername
                                            }
                                        />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </main>
    );
}
