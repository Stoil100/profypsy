import { db } from "@/firebase/config";
import { ArticleT } from "@/models/article";
import { ProfileT } from "@/models/profile";
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";

export function fetchProfile(
    uid: string,
    role: string,
    setProfile: (profile: ProfileT) => void,
) {
    const userRef = doc(db, "users", uid);

    const unsubscribe = onSnapshot(
        userRef,
        (docSnap) => {
            if (!docSnap.exists()) {
                console.log("User not found");
                return;
            }

            if (role === "psychologist") {
                const psychologistRef = doc(db, "psychologists", uid);
                return onSnapshot(
                    psychologistRef,
                    (docSnapPsychologist) => {
                        if (docSnapPsychologist.exists()) {
                            setProfile(docSnapPsychologist.data() as ProfileT);
                        } else {
                            console.log("Psychologist profile not found");
                        }
                    },
                    (error) => {
                        console.error(error.message);
                    },
                );
            } else {
                setProfile(docSnap.data() as ProfileT);
            }
        },
        (error) => {
            console.error(error.message);
        },
    );

    return unsubscribe;
}

export function fetchArticles(setArticles: (articles: ArticleT[]) => void) {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("published", "==", true));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const articles: ArticleT[] = [];
        querySnapshot.forEach((doc) => {
            articles.push({ id: doc.id, ...doc.data() } as ArticleT);
        });
        setArticles(articles);
    });

    return unsubscribe;
}

export async function deleteArticle(articleId: string) {
    try {
        await deleteDoc(doc(db, "articles", articleId));
        console.log("Article deleted successfully");
    } catch (error) {
        console.error("Error deleting article:", error);
    }
}

export async function markSession(
    collectionName: string,
    uid: string,
    index: number,
) {
    const userRef = doc(db, collectionName, uid);
    try {
        await updateDoc(userRef, {
            [`appointments.${index}.new`]: false,
        });
        console.log("Session marked as read");
    } catch (error) {
        console.error("Error marking session as read:", error);
    }
}
