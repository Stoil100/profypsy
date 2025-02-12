import { db } from "@/firebase/config";
import { AppointmentT } from "@/models/appointment";
import { ArticleT } from "@/models/article";
import { ProfileT } from "@/models/profile";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    updateDoc,
    where
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

export function fetchArticles(
    setArticles: (articles: ArticleT[]) => void,
    uid: string,
) {
    const q = query(collection(db, "articles"), where("creator", "==", uid));
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
    const documentRef = doc(db, collectionName, uid);

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
}
