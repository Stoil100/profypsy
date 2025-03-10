"use client";

import { ArticlesList } from "@/components/bookings/id/ArticlesList";
import { BookingCarousel } from "@/components/bookings/id/Carousel";
import { BookingDialog } from "@/components/bookings/id/Dialog";
import { ProfileDetails } from "@/components/bookings/id/ProfileDetails";
import { ProfileHeader } from "@/components/bookings/id/ProfileHeader";
import Loader from "@/components/Loader";
import { useAuth } from "@/components/Providers";
import { db } from "@/firebase/config";
import { ArticleT } from "@/models/article";
import { PsychologistT } from "@/models/psychologist";
import {
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BookingIdPage({ params }: { params: { id: string } }) {
    const t = useTranslations("Pages.Search.Id");
    const { user } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<PsychologistT | null>(null);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
    const [selectedAppointmentTime, setSelectedAppointmentTime] = useState<
        string | null
    >(null);
    const [articles, setArticles] = useState<ArticleT[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user.uid) {
            router.push("/login");
        }
    }, [router, user]);

    useEffect(() => {
        async function fetchProfile() {
            if (!params.id) return;
            try {
                const docRef = doc(db, "psychologists", params.id);
                const docSnap = await getDoc(docRef);
                setProfile(docSnap.data() as PsychologistT);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, [params.id]);

    useEffect(() => {
        if (profile?.variant === "Premium" || profile?.variant === "Deluxe") {
            const q = query(
                collection(db, "articles"),
                where("creator", "==", profile.uid),
                where("approved", "==", true),
                orderBy("createdAt"),
            );
            const unsubscribe = onSnapshot(
                q,
                (querySnapshot) => {
                    const articles: ArticleT[] = querySnapshot.docs.map(
                        (doc) =>
                            ({
                                id: doc.id,
                                ...doc.data(),
                            }) as ArticleT,
                    );

                    setArticles(articles);
                },
                (error) => {
                    console.error("Error fetching items:", error);
                },
            );
            return unsubscribe;
        }
    }, [profile]);

    if (isLoading) {
        return <Loader />;
    }

    if (!profile) {
        return <div>{t("profileNotFound")}</div>;
    }

    return (
        <section className="relative flex min-h-screen w-full gap-4 text-[#205041] md:p-4 lg:p-8">
            <div className="w-full space-y-4 p-4 font-playfairDSC shadow-xl md:w-2/3">
                <ProfileHeader
                    t={(key) => t(`header.${key}`)}
                    profile={profile}
                    onBookNow={() => setIsBookingDialogOpen(true)}
                />
                <hr className="w-full rounded-full border-2 border-[#F7F4E0]" />
                <ProfileDetails
                    profile={profile}
                    t={(key) => t(`details.${key}`)}
                />
                <hr className="w-full rounded-full border-2 border-[#F7F4E0]" />
                <ArticlesList
                    articles={articles}
                    t={(key) => t(`articles.${key}`)}
                />
            </div>
            <div className="sticky top-[calc(var(--nav-height)+1rem)] hidden max-h-[calc(100vh-var(--nav-height)-2rem)] border-4 border-[#25BA9E] bg-[#FCFBF4] md:block md:w-1/3">
                {user.uid && profile?.uid && (
                    <BookingCarousel
                        profile={profile}
                        user={user}
                        setSelectedAppointmentTime={setSelectedAppointmentTime}
                        selectedAppointmentTime={selectedAppointmentTime}
                        t={(key) => t(`booking.${key}`)}
                    />
                )}
            </div>
            <BookingDialog
                isOpen={isBookingDialogOpen}
                onClose={() => setIsBookingDialogOpen(false)}
                profile={profile}
                user={user}
                selectedAppointmentTime={selectedAppointmentTime}
                setSelectedAppointmentTime={setSelectedAppointmentTime}
                t={(key) => t(`booking.${key}`)}
            />
        </section>
    );
}
