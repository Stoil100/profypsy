"use client";

import MainButton from "@/components/MainButton";
import { useAuth } from "@/components/Providers";
import { ProfileCard } from "@/components/bookings/ProfileCard";
import { SearchFormCarousel } from "@/components/bookings/SearchFormCarousel";
import { SearchSchema, SearchSchemaType } from "@/components/schemas/search";
import { Form } from "@/components/ui/form";
import { db } from "@/firebase/config";
import type { PsychologistT } from "@/models/psychologist";
import { zodResolver } from "@hookform/resolvers/zod";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { SearchCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Loader = ({ t }: { t: (args: string) => string }) => {
    return (
        <div className="fixed top-0 z-[9999] flex h-screen w-full flex-col items-center justify-center gap-5 bg-[#FCFBF4]">
            <SearchCheck className="animate-bounce text-[#205041]" size={90} />
            <h2 className="font-playfairDSC text-5xl text-[#205041]">
                {t("loadingSelection")}
            </h2>
            <p className="text-xl text-[#128665]">{t("tailoredSearch")}</p>
        </div>
    );
};

const BookingPage: React.FC = () => {
    const t = useTranslations("Pages.Search");
    const [isLoading, setIsLoading] = useState(false);
    const [finnishedOptions, setFinnishedOptions] = useState(false);
    const [isShown, setIsShown] = useState(false);
    const [psychologists, setPsychologists] = useState<PsychologistT[]>([]);
    const { user } = useAuth();
    const router = useRouter();
    const formSchema = SearchSchema(t);

    const form = useForm<SearchSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            support: "you",
            languages: [],
            concern: "little",
        },
    });
    useEffect(() => {
        if (!user.uid) {
            router.push("/login");
        }
    }, [user, router]);

    const fetchItems = (searchValues: SearchSchemaType) => {
        setFinnishedOptions(true);
        setIsLoading(true);

        const supportQuery = query(
            collection(db, "psychologists"),
            where("approved", "==", true),
            searchValues.support
                ? where(
                      "specializations",
                      "array-contains",
                      searchValues.support,
                  )
                : where("approved", "==", true), // No additional filter if no support selected
        );

        let unsubscribe: (() => void) | null = null;

        try {
            unsubscribe = onSnapshot(supportQuery, (querySnapshot) => {
                let tempValues: PsychologistT[] = [];

                querySnapshot.forEach((doc) => {
                    tempValues.push(doc.data() as PsychologistT);
                });

                // **Apply language filtering AFTER fetching**
                if (searchValues.languages.length > 0) {
                    tempValues = tempValues.filter((psychologist) =>
                        psychologist.languages?.some((lang: string) =>
                            searchValues.languages.includes(
                                lang as "en" | "bg",
                            ),
                        ),
                    );
                }

                setPsychologists(tempValues);
                setIsLoading(false);
            });
        } catch (error) {
            console.error("Error fetching items: ", error);
            setIsLoading(false);
        }

        // Return function to unsubscribe from Firestore listeners
        return () => {
            if (unsubscribe) unsubscribe();
        };
    };

    function onSubmit(data: SearchSchemaType) {
        fetchItems(data);
    }
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden font-openSans">
            {!finnishedOptions && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="relative h-screen w-screen"
                    >
                        <SearchFormCarousel
                            form={form}
                            t={(key) => t(`options.${key}`)}
                        />
                    </form>
                </Form>
            )}
            {isLoading && <Loader t={t} />}
            {psychologists.length !== 0 ? (
                <>
                    <section className="flex min-h-screen w-full flex-col items-center gap-7 px-6 pb-2 md:gap-14">
                        <div className="mt-20 flex flex-col items-center justify-center gap-4">
                            <h3 className="text-center font-playfairDSC text-3xl uppercase text-[#128665]">
                                {t("topPsychologists")}
                            </h3>
                            <p className="text-xl text-[#205041]">
                                {t("pickedForYou")}
                            </p>
                        </div>
                        <div className="flex w-full flex-wrap items-center justify-center gap-10 md:w-2/3">
                            {psychologists.length > 0 ? (
                                ["Deluxe", "Premium", "Basic"].map(
                                    (variant) => {
                                        const filteredPsychologists =
                                            psychologists.filter(
                                                (p) => p.variant === variant,
                                            );
                                        if (filteredPsychologists.length > 0) {
                                            return filteredPsychologists
                                                .slice(0, 3)
                                                .map((psychologist, index) => (
                                                    <ProfileCard
                                                        psychologist={
                                                            psychologist
                                                        }
                                                        t={(key) =>
                                                            t(`card.${key}`)
                                                        }
                                                        key={`${variant}-${index}`}
                                                    />
                                                ));
                                        }
                                        return null;
                                    },
                                )
                            ) : (
                                <p>{t("noPsychologistsAvailable")}</p>
                            )}
                        </div>
                        {!isShown && (
                            <MainButton
                                onClick={() => {
                                    window.scrollBy({
                                        top: 100,
                                        behavior: "smooth",
                                    });
                                    setIsShown(true);
                                }}
                            >
                                {t("showAllPsychologists")} (
                                {psychologists.length -
                                    psychologists
                                        .filter((p) => p.variant === "Deluxe")
                                        .slice(0, 3).length}
                                )
                            </MainButton>
                        )}
                    </section>
                    {isShown && (
                        <section className="flex h-fit w-full flex-col items-center justify-center gap-6 bg-gradient-to-b from-[#40916C] to-[#52B788] px-4 py-10">
                            <h2 className="font-playfairDSC text-4xl text-white drop-shadow-xl [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
                                {t("selectionOfChoices")}
                            </h2>
                            <div className="flex w-full flex-wrap items-center justify-center gap-10 md:w-2/3">
                                {psychologists.map((psychologist, index) => (
                                    <ProfileCard
                                        psychologist={psychologist}
                                        t={(key) => t(`card.${key}`)}
                                        key={index}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            ) : (
                finnishedOptions &&
                !isLoading && (
                    <div className="flex flex-col items-center justify-center gap-2 p-2">
                        <Image
                            src="/logic/notfound.svg"
                            alt="Search failed"
                            width={500}
                            height={500}
                        />
                        <p className="text-center text-3xl text-[#205041]">
                            {t("noMatchFound")}
                        </p>
                    </div>
                )
            )}
        </main>
    );
};

export default BookingPage;
