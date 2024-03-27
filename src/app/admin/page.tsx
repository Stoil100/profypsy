"use client";

import React, { useEffect, useState } from "react";
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { PsychologistProfile } from "@/components/forms/appliance";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin, Pin } from "lucide-react";

type ProfileProps = Omit<
    PsychologistProfile,
    "appointments" | "approved" | "duration" | "rating" | "trial" | "variant"
>;
const ProfileInfo:React.FC<ProfileProps>=(profile)=>{
    async function ApprovePsychologist(uid: string) {
        const psychologistsRef = doc(db, "psychologists", uid);
        await updateDoc(psychologistsRef, {
            approved: true,
        });
    }

    return (
        <div className="flex h-fit w-full flex-col gap-4">
            <div className="flex w-full h-fit items-center gap-2 py-4">
                <div className="flex h-full flex-col items-center justify-between gap-2 w-1/3 border">
                    <img
                        src={profile.image}
                        alt="Profile Image"
                        className="size-[150px] rounded-full border-2 "
                    />
                   
                    <h1 className="text-4xl">
                        {profile.userName.firstName} {profile.userName.lastName}
                    </h1>
                    <div className="flex items-center justify-between gap-2 text-xl">
                        <p>{profile.email}</p>
                        <p>Age: {profile.age}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xl">
                        <MapPin/>
                        <p>{profile.location}</p>
                    </div>
                    <p>{profile.about}</p>
                    <p>&quot;{profile.quote}&quot;</p>
                    <div className="flex gap-2 items-center justify-center">
                        {profile.languages.map((language,index) => (
                            <p key={index}>{language}</p>
                        ))}
                    </div>
                </div>
                <div className="flex h-full flex-col justify-around text-2xl w-1/3 border">
                    <ul className="list-decimal">
                        <h2>Educations:</h2>
                        {profile.educations.map((education, index) => (
                            <li key={index}>{education.education}</li>
                        ))}
                    </ul>
                    <ul className="list-decimal">
                        <h2>Experiences:</h2>
                        {profile.experiences.map((experience, index) => (
                            <li key={index}>{experience.experience}</li>
                        ))}
                    </ul>
                </div>
                <div className="h-full flex items-center flex-col justify-center gap-2 w-1/3 border">
                    <iframe src={profile.cv} />
                    <iframe src={profile.diploma} />
                    <iframe src={profile.letter} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* <Button
                onClick={() => {
                    DenyPsychologist(profile.uid);
                }}
                    className="w-full"
            >
                Approve
            </Button> */}
                <Button
                    onClick={() => {
                        ApprovePsychologist(profile.uid);
                    }}
                    className="w-full"
                >
                    Approve
                </Button>
            </div>
        </div>
    );
}

export default function AdminPage() {
    const [profilesToApprove, setProfilesToApprove] =
        useState<PsychologistProfile[]>();
        useEffect(() => {
            const q = query(collection(db, "psychologists"), where("approved", "==", false));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const tempValues: PsychologistProfile[] = [];
                querySnapshot.forEach((doc) => {
                    tempValues.push(doc.data() as PsychologistProfile);
                });
                setProfilesToApprove(tempValues);
            });
            return () => unsubscribe();
        }, []);

   
    return (
        <div className="h-fit min-h-screen w-full bg-[#F1ECCC] p-3">
            {profilesToApprove?.map((profile, index) => (
                <ProfileInfo
                    uid={profile.uid}
                    image={profile.image}
                    about={profile.about}
                    age={profile.age}
                    cost={profile.cost}
                    educations={profile.educations}
                    email={profile.email}
                    experiences={profile.experiences}
                    languages={profile.languages}
                    location={profile.location}
                    phone={profile.phone}
                    quote={profile.quote}
                    specializations={profile.specializations}
                    cv={profile.cv}
                    diploma={profile.diploma}
                    letter={profile.letter}
                    userName={profile.userName}
                    key={index}
                />
            ))}
        </div>
    );
}
