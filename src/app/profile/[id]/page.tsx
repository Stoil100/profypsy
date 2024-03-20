"use client";
// pages/profile!/[uid].tsx
import { GetServerSideProps, NextPage } from "next";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/Providers";
import { useRouter } from "next/navigation";
import { PsychologistProfile } from "@/components/forms/appliance";
import { AppointmentT } from "@/app/(logic)/search/[id]/page";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    BellDot,
    Calendar,
    Info,
    Mail,
    Phone,
    Settings,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import GradientButton from "@/components/GradientButton";
import { Dialog } from "@radix-ui/react-dialog";
import ChatInterface from "@/components/Chat";
import { DialogContent } from "@/components/ui/dialog";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const uid = context.params?.uid as string;

//     // Fetch user data from Firestore
//     const docRef = doc(db, "psychologists", uid);
//     const docSnap = await getDoc(docRef);

//     if (!docSnap.exists()) {
//         return {
//             notFound: true, // Return a 404 page if the user does not exist
//         };
//     }

//     return {
//         props: {
//             userData: JSON.parse(JSON.stringify(docSnap.data())), // Pass user data as props to the page component
//         },
//     };
// };
type ProfileT = PsychologistProfile & AppointmentT;

export default function Page({ params }: { params: { id: string } }) {
    const { user, logOut } = useAuth();
    const [profile, setProfile] = useState<ProfileT>();
    const [chatProps,setChatProps] = useState({userUid:"",profileUid:""});
    const router = useRouter();
    useEffect(() => {
        if (!user?.uid || user.uid !== params.id) {
            router.push(`/profile!/${user?.uid}`);
        } else if (!user?.uid) {
            router.push("/login");
        }
    }, [user, params.id, router]);
    useEffect(() => {
        async function getUserData() {
            const docRef = doc(db, "users", params.id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                return {
                    notFound: true, // Return a 404 page if the user does not exist
                };
            }
            if (user.role === "psychologist") {
                const docRef = doc(db, "psychologists", params.id);
                const docSnapPsychologist = await getDoc(docRef);
                setProfile(docSnapPsychologist.data() as ProfileT);
            } else {
                setProfile(docSnap.data() as ProfileT);
            }
        }
        getUserData();
    }, []);

    function toggleChat(userUid:string,profileUid:string){
        setChatProps({userUid,profileUid })
    }
    console.log(user);
    return (
        <main
            className={cn(
                "flex h-fit min-h-screen items-center justify-center bg-gradient-to-b py-4",
                user.role === "psychologist"
                    ? "from-[#40916C] to-[#52B788]"
                    : "from-[#F7F4E0] to-[#F1ECCC]",
            )}
        >
            {user.uid && profile! && (
                <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-white p-4 sm:w-[500px]">
                    <h2 className="font-playfairDSC text-4xl font-bold ">
                        Profile
                    </h2>
                    <div className="flex items-center gap-2">
                        {profile!.image?

                        <img
                            src={profile!.image!}
                            className="size-32 rounded-full border-4 border-[#25BA9E] p-1 shadow-2xl"
                           
                        />: <div className="p-4 border-2 rounded-full"><User size={42}/></div>
}
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
                    <Tabs defaultValue="settings" className="">
                        <TabsList className="w-full">
                            <TabsTrigger value="settings">
                                <Settings className="sm:mr-2" />
                                <p className="hidden sm:block">Account</p>
                            </TabsTrigger>
                            {user!.appointments!.length > 0 && (
                                <TabsTrigger value="appointments">
                                    <Calendar className="sm:mr-2" />
                                    <p className="hidden sm:block">
                                        Appointments
                                    </p>
                                </TabsTrigger>
                            )}
                            {profile!.appointments!.length > 0 &&
                                user.role === "psychologist" && (
                                    <TabsTrigger value="sessions">
                                        <BellDot className="sm:mr-2" />
                                        <p className="hidden sm:block">
                                            Sessions
                                        </p>
                                    </TabsTrigger>
                                )}
                        </TabsList>
                        <TabsContent
                            value="settings"
                            className="w-full space-y-4"
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
                                            <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-full border-2  border-dashed border-black p-2 ">
                                                <p>{profile!.about}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-1 rounded-xl bg-gray-100 p-2 md:col-span-2">
                                            <p>Quote:</p>
                                            <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-full border-2  border-dashed border-black p-2 ">
                                                <p className="italic">
                                                    &quot;{profile!.quote}&quot;
                                                </p>
                                            </div>
                                        </div>
                                        {profile!.educations && (
                                            <div className="col-span-1 rounded-xl bg-gray-100 p-2 md:col-span-2">
                                                <p>Education:</p>
                                                <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-full border-2  border-dashed border-black p-2 ">
                                                    {profile!.educations.map(
                                                        (education) => (
                                                            <p
                                                                key={
                                                                    education.education
                                                                }
                                                                className="rounded-full bg-blue-100 px-4 py-1"
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
                                                <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-full border-2  border-dashed border-black p-2 ">
                                                    {profile!.experiences.map(
                                                        (experience) => (
                                                            <p
                                                                key={
                                                                    experience.experience
                                                                }
                                                                className="rounded-full bg-blue-100 px-4 py-1"
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
                                {user.appointments?.map(
                                    (appointment, index) => (
                                        <AccordionItem
                                            value={`item-${index}`}
                                            key={index}
                                        >
                                            <AccordionTrigger>
                                                {appointment.selectedDate}
                                            </AccordionTrigger>
                                            <AccordionContent className="p-4">
                                                <div className="space-y-4">
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
                                                        className="text-xl"
                                                        buttonClassName="w-full border-[#25BA9E] border-2"
                                                        onClick={() => {
                                                            toggleChat(
                                                                user.uid!,
                                                                appointment!.clientUid,
                                                            );
                                                        }}
                                                    >
                                                        Chat now
                                                    </GradientButton>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ),
                                )}
                            </Accordion>
                            {chatProps.userUid !== "" && (
                                <Dialog
                                    open={chatProps.userUid !== ""}
                                    onOpenChange={() => {
                                        setChatProps({
                                            userUid: "",
                                            profileUid: "",
                                        });
                                    }}
                                >
                                    <DialogContent>
                                        <ChatInterface
                                            senderUid={chatProps.userUid}
                                            receiverUid={chatProps.profileUid}
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
                                {profile!.appointments?.map(
                                    (appointment, index) => (
                                        <AccordionItem
                                            value={`item-${index}`}
                                            key={index}
                                        >
                                            <AccordionTrigger>
                                                {appointment.selectedDate}
                                            </AccordionTrigger>
                                            <AccordionContent className="p-4">
                                                <div className="space-y-4">
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
                                                        className="text-xl"
                                                        buttonClassName="w-full border-[#25BA9E] border-2"
                                                        onClick={() => {
                                                            toggleChat(
                                                                appointment.clientUid!,
                                                                user!.uid!,
                                                            );
                                                        }}
                                                    >
                                                        Chat now
                                                    </GradientButton>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ),
                                )}
                            </Accordion>
                            {chatProps.userUid !== "" && (
                                <Dialog
                                    open={chatProps.userUid !== ""}
                                    onOpenChange={() => {
                                        setChatProps({
                                            userUid: "",
                                            profileUid: "",
                                        });
                                    }}
                                >
                                    <DialogContent>
                                        <ChatInterface
                                            senderUid={chatProps.userUid}
                                            receiverUid={chatProps.profileUid}
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
