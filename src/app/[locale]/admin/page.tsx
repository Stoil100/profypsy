"use client";

import { useAuth } from "@/components/Providers";
import { ArticleForm } from "@/components/forms/article/Content";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase/config";
import { ArticleT } from "@/models/article";
import { PsychologistT } from "@/models/psychologist";
import {
    WhereFilterOp,
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProfileInfo: React.FC<PsychologistT> = (profile) => {
    async function ApprovePsychologist(uid: string) {
        const psychologistsRef = doc(db, "psychologists", uid);
        await updateDoc(psychologistsRef, {
            approved: true,
        });
    }

    return (
        <div className="flex h-fit w-full flex-col gap-4">
            <div className="flex h-fit w-full items-center gap-2 py-4">
                <div className="flex h-full w-1/3 flex-col items-center justify-between gap-2 border">
                    <img
                        src={profile.image!}
                        alt="Profile Image"
                        className="size-[150px] rounded-full border-2 "
                    />

                    <h1 className="text-4xl">{profile.userName}</h1>
                    <div className="flex items-center justify-between gap-2 text-xl">
                        <p>{profile.email}</p>
                        <p>Age: {profile.age}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xl">
                        <MapPin />
                        <p>{profile.location}</p>
                    </div>
                    <p>{profile.about}</p>
                    <p>&quot;{profile.quote}&quot;</p>
                    <div className="flex items-center justify-center gap-2">
                        {profile.languages.map((language, index) => (
                            <p key={index}>{language}</p>
                        ))}
                    </div>
                </div>
                <div className="flex h-full w-1/3 flex-col justify-around border text-2xl">
                    <ul className="list-decimal">
                        <h2>Educations:</h2>
                        {profile.educations.map((education, index) => (
                            <li key={index}>{education.value}</li>
                        ))}
                    </ul>
                    <ul className="list-decimal">
                        <h2>Experiences:</h2>
                        {profile.experiences.map((experience, index) => (
                            <li key={index}>{experience.value}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex h-full w-1/3 flex-col items-center justify-center gap-2 border">
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
                    Deny
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
};
const ArticleInfo: React.FC<ArticleT> = (article) => {
    async function ApproveArticle(id: string) {
        const articlesRef = doc(db, "articles", id);
        await updateDoc(articlesRef, {
            approved: true,
        });
    }

    return (
        <div className="flex h-fit w-full flex-col gap-4">
            <h2 className="text-4xl">Preview article before upload:</h2>
            <div className="flex flex-col rounded border border-black bg-white p-6">
                <h2 className="mb-4 text-center text-7xl font-bold underline decoration-4">
                    {article.title}
                </h2>
                <div>
                    {article.titleDescriptions?.map((title) => (
                        <h4
                            key={title.id}
                            className="mb-2 text-center text-4xl"
                        >
                            {title.value}
                        </h4>
                    ))}
                </div>

                <img
                    className="w-full max-w-sm object-cover"
                    src={article.heroImage}
                    alt="article image"
                />
                <div className="px-4 pt-2">
                    {article.descriptions!.map((description) => (
                        <p className="px-2 text-xl" key={description.id}>
                            {description.value}
                        </p>
                    ))}
                </div>
                <div className="p-4">
                    {article!.lists!.map((list, listIndex) => (
                        <>
                            <h5 className="text-3xl">{list.title}</h5>
                            <ul
                                key={listIndex}
                                className="list-decimal px-10 py-2 text-lg"
                            >
                                {list.items!.map((item) => (
                                    <li key={item.id}>{item.value}</li>
                                ))}
                            </ul>
                        </>
                    ))}
                </div>
                <h5>{article!.footer!}</h5>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    onClick={() => {
                        ApproveArticle(article.id!.toString()!);
                    }}
                    className="w-full"
                >
                    Approve
                </Button>
            </div>
        </div>
    );
};
function useFirestoreCollection<T>(
    collectionName: string,
    condition: [string, WhereFilterOp, any],
) {
    const [data, setData] = useState<T[]>();

    useEffect(() => {
        const [field, operator, value] = condition;
        const q = query(
            collection(db, collectionName),
            where(field, operator, value),
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const tempValues: T[] = [];
            querySnapshot.forEach((doc) => {
                tempValues.push(doc.data() as T);
            });
            setData(tempValues);
        });

        return () => unsubscribe();
    }, [collectionName, condition]);

    return data;
}
export default function AdminPage() {
    const { user } = useAuth();
    const router = useRouter();

    // Use the custom hook for real-time updates
    const uploadedArticles = useFirestoreCollection<ArticleT>("articles", [
        "approved",
        "!=",
        null, // Adjust the condition if necessary
    ]);

    async function deleteArticle(id: string) {
        try {
            await deleteDoc(doc(db, "articles", id));
        } catch (error) {
            console.error("Error deleting article:", error);
        }
    }

    useEffect(() => {
        if (!user?.admin) {
            router.push("/");
        }
    }, [user, router]);

    const profilesToApprove = useFirestoreCollection<PsychologistT>(
        "psychologists",
        ["approved", "==", false],
    );

    const articlesToApprove = useFirestoreCollection<ArticleT>("articles", [
        "approved",
        "==",
        false,
    ]);
    if (!user?.admin) return;
    return (
        <main className="min-h-screen w-full space-y-4 px-2 py-10">
            <div className="h-fit p-3">
                {profilesToApprove?.map((profile, index) => (
                    <ProfileInfo {...profile} key={index} />
                ))}
            </div>
            <div className="space-y-2 rounded border border-black p-2">
                <h2 className="text-center text-3xl">Articles Section:</h2>
                <div className="flex flex-col">
                    {articlesToApprove?.map((article, index) => (
                        <ArticleInfo {...article} key={index} />
                    ))}
                </div>
                {uploadedArticles?.length! > 0 && (
                    <div className="h-fit w-full  border-b border-black">
                        <h2 className="text-4xl">Delete articles:</h2>
                        <div className="flex flex-wrap gap-4 ">
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
                                            src={article.heroImage}
                                            alt={article.title}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        className="w-full"
                                        onClick={() =>
                                            deleteArticle(
                                                article.id?.toString()!,
                                            )
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="space-y-2">
                    <h2 className="text-4xl">Upload Article:</h2>
                    <ArticleForm />
                </div>
            </div>
        </main>
    );
}
