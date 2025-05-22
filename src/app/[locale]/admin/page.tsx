"use client";

import { ArticleDialog } from "@/components/admin/ArticleDialog";
import { ArticleInfo } from "@/components/admin/ArticleInfo";
import { useFirestoreCollection } from "@/components/admin/hooks";
import { ProfileInfo } from "@/components/admin/ProfileInfo";
import { ArticleForm } from "@/components/forms/article/Content";
import { useAuth } from "@/components/Providers";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase/config";
import type { ArticleT } from "@/models/article";
import type { PsychologistT } from "@/models/psychologist";
import { deleteDoc, doc } from "firebase/firestore";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "use-intl";

export default function AdminPage() {
    const t = useTranslations("Pages.Admin");
    const { user } = useAuth();
    const router = useRouter();
    const [previewArticle, setPreviewArticle] = useState<ArticleT>();

    const uploadedArticles = useFirestoreCollection<ArticleT>("articles", [
        "approved",
        "==",
        true,
    ]);

    const uploadedProfiles = useFirestoreCollection<PsychologistT>(
        "psychologists",
        ["approved", "==", true],
    );

    const profilesToApprove = useFirestoreCollection<PsychologistT>(
        "psychologists",
        ["approved", "==", false],
    );

    const articlesToApprove = useFirestoreCollection<ArticleT>("articles", [
        "approved",
        "==",
        false,
    ]);
    useEffect(() => {
        if (!user?.admin) {
            router.push("/");
        }
    }, [user, router]);

    const deleteArticle = async (id: string) => {
        try {
            await deleteDoc(doc(db, "articles", id));
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    };

    if (!user?.admin) return null;

    return (
        <>
            <main className="min-h-screen w-full space-y-4 px-2 py-10">
                <section className="h-fit space-y-4 rounded border border-black p-4">
                    <h2 className="text-center text-3xl">
                        {t("profile.section")}
                    </h2>
                    {profilesToApprove?.length > 0 && (
                        <div className="space-y-2">
                            <h2 className="text-4xl">{t("profile.preview")}</h2>
                            {profilesToApprove.map((profile, index) => (
                                <ProfileInfo
                                    profile={profile}
                                    key={index}
                                    t={(key) => t(`profile.${key}`)}
                                />
                            ))}
                        </div>
                    )}
                    {uploadedProfiles?.length > 0 && (
                        <div className="h-fit w-full space-y-4 border-b border-black p-2">
                            <h2 className="text-4xl">{t("profile.edit")}</h2>
                            <div className="flex flex-wrap gap-4">
                                {uploadedProfiles.map((profile, index) => (
                                    <ProfileInfo
                                        profile={profile}
                                        key={index}
                                        t={(key) => t(`profile.${key}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                <section className="space-y-2 rounded border border-black p-2">
                    <h2 className="text-center text-3xl">
                        {t("articles.section")}
                    </h2>
                    {articlesToApprove?.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <h2 className="text-4xl">
                                {t("articles.preview")}
                            </h2>
                            {articlesToApprove.map((article, index) => (
                                <ArticleInfo
                                    setPreviewArticle={setPreviewArticle}
                                    article={article}
                                    key={index}
                                    t={(key) => t(`articles.${key}`)}
                                />
                            ))}
                        </div>
                    )}

                    {uploadedArticles?.length > 0 && (
                        <div className="h-fit w-full space-y-4 border-b border-black p-2">
                            <h2 className="text-4xl">{t("articles.delete")}</h2>
                            <div className="flex flex-wrap gap-4">
                                {uploadedArticles?.map((article, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center justify-center gap-1 rounded-lg bg-gray-400/20 p-3 sm:w-1/2 md:w-1/3"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <h2 className="text-4xl">
                                                {article.title}
                                            </h2>
                                            <img
                                                src={
                                                    article.heroImage ||
                                                    "/placeholder.svg"
                                                }
                                                alt={article.title}
                                            />
                                        </div>
                                        <div className="flex w-full gap-2">
                                            <Button
                                                type="button"
                                                className="w-full"
                                                variant="destructive"
                                                onClick={() =>
                                                    deleteArticle(
                                                        article.id?.toString()!,
                                                    )
                                                }
                                            >
                                                {t("articles.button")}
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    setPreviewArticle(article)
                                                }
                                                className="bg-[#25BA9E] hover:bg-[#25BA9E]/80"
                                            >
                                                <EyeIcon />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <h2 className="text-4xl">{t("articles.upload")}</h2>
                        <ArticleForm />
                    </div>
                </section>
            </main>
            <ArticleDialog
                article={previewArticle}
                setPreviewArticle={setPreviewArticle}
            />
        </>
    );
}
