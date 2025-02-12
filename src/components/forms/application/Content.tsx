"use client";

import { useAuth } from "@/components/Providers";
import { ApplicationSchema } from "@/components/schemas/application";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { db } from "@/firebase/config";
import { cn } from "@/lib/utils";
import type { PsychologistT } from "@/models/psychologist";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, updateDoc } from "firebase/firestore";
import { Briefcase, GraduationCap, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EducationTab } from "./EducationTab";
import { ExperienceTab } from "./ExperienceTab";
import { InfoTab } from "./InfoTab";
import { submitApplicationData } from "./utils";
type Props = {
    className?: string;
    profile?: PsychologistT;
    setIsEditing?: (isEditing: boolean) => void;
};

export default function ApplicationForm({
    className,
    profile,
    setIsEditing,
}: Props) {
    const t = useTranslations("Pages.Application");
    const { user } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState("info");

    const [selectedSubscription, setSelectedSubscription] =
        useState<PsychologistT["variant"]>("Premium");

    const formSchema = ApplicationSchema((key) => t(`form.errors.${key}`));
    type FormValues = z.infer<typeof formSchema>;
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: profile
            ? {
                  userName: profile.userName,
                  phone: profile.phone,
                  about: profile.about,
                  image: profile.image!,
                  dates: profile.dates as (
                      | "monday"
                      | "tuesday"
                      | "wednesday"
                      | "thursday"
                      | "friday"
                      | "saturday"
                      | "sunday"
                  )[],
                  price: profile.price,
                  educations: profile.educations,
                  experiences: profile.experiences,
                  location: profile.location,
                  specializations: profile.specializations,
                  cv: profile.cv,
                  diploma: profile.diploma,
                  letter: profile.letter,
                  languages: profile.languages,
                  age: profile.age,
                  quote: profile.quote,
                  variant: profile.variant,
              }
            : {
                  userName: user?.userName || "",
                  phone: user?.phone || "",
                  image: user?.image || undefined,
                  about: "",
                  dates: ["saturday", "sunday"],
                  price: "",
                  educations: [{ id: Date.now(), value: "" }],
                  experiences: [{ id: Date.now(), value: "" }],
                  location: "",
                  specializations: [],
                  cv: undefined,
                  diploma: undefined,
                  letter: undefined,
                  languages: [],
                  age: "18",
                  quote: "",
                  variant: "Premium",
              },
    });

    const onSubmit = async (values: FormValues) => {
        if (!user) return;
        if (!!profile) {
            await updateDoc(doc(db, "psychologists", user.uid!), { ...values });
            toast({
                title: t("upload.edit.title"),
                description: t("upload.edit.description"),
            });
            setIsEditing!(false);
        } else {
            await submitApplicationData(
                {
                    ...values,
                    email: user?.email || "",
                    duration: "Monthly",
                    rating: 0,
                    trial: true,
                    approved: false,
                    uid: user?.uid || "",
                    appointments: user.appointments || [],
                },
                user.uid!,
                router,
                t,
            );
            toast({
                title: t("upload.success.title"),
                description: t("upload.success.description"),
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    "z-10 w-full space-y-8 bg-white md:px-2 py-2",
                    className,
                )}
            >
                <Tabs
                    defaultValue="info"
                    value={tab}
                    className="w-full sm:px-6"
                >
                    <TabsList className="h-fit w-full space-x-2 text-[#09243E]">
                        <TabsTrigger
                            value="info"
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 sm:flex-row",
                                tab === "info" &&
                                    "rounded-full !bg-[#25BA9E99] !text-white",
                            )}
                            onClick={() => setTab("info")}
                        >
                            <Info className="size-6" />
                            <p className="hidden md:block">
                                {t("form.tabs.info")}
                            </p>
                        </TabsTrigger>
                        <TabsTrigger
                            value="education"
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 sm:flex-row",
                                tab === "education" &&
                                    "rounded-full !bg-[#25BA9E80] !text-white",
                            )}
                            onClick={() => setTab("education")}
                        >
                            <GraduationCap className="size-6" />
                            <p className="hidden md:block">
                                {t("form.tabs.education")}
                            </p>
                        </TabsTrigger>
                        <TabsTrigger
                            value="experience"
                            className={cn(
                                "flex flex-col items-center justify-center gap-2 sm:flex-row",
                                tab === "experience" &&
                                    "rounded-full !bg-[#25BA9E80] !text-white",
                            )}
                            onClick={() => setTab("experience")}
                        >
                            <Briefcase className="size-6" />
                            <p className="hidden md:block">
                                {t("form.tabs.experience")}
                            </p>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">
                        <InfoTab
                            form={form}
                            setTab={setTab}
                            t={(key) => t(`form.fields.${key}`)}
                        />
                    </TabsContent>
                    <TabsContent value="education">
                        <EducationTab
                            form={form}
                            setTab={setTab}
                            t={(key) => t(`form.fields.${key}`)}
                        />
                    </TabsContent>
                    <TabsContent value="experience">
                        <ExperienceTab
                            form={form}
                            selectedSubscription={selectedSubscription}
                            setSelectedSubscription={setSelectedSubscription}
                            setTab={setTab}
                            t={(key) => t(`form.fields.${key}`)}
                        />
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    );
}
