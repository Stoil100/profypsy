import { toast } from "@/components/ui/use-toast";
import { db } from "@/firebase/config";
import { PsychologistT } from "@/models/psychologist";
import { doc, FirestoreError, setDoc, updateDoc } from "firebase/firestore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const submitApplicationData = async (
    values: PsychologistT,
    uid: string,
    router: AppRouterInstance,
    t: any,
) => {
    try {
        await setDoc(doc(db, "psychologists", uid), values);
        await updateDoc(doc(db, "users", uid), {
            role: "psychologist",
        });
        toast({
            title: t("upload.thanksForApplyingTitle"),
            description: t("upload.thanksForApplyingDescription", {
                email: values.email,
            }),
        });
        router.push(`/profile`);
    } catch (error) {
        const firestoreError = error as FirestoreError;
        toast({
            title: t("upload.errorUploadingDocumentTitle"),
            description: `${firestoreError.message}`,
        });
        router.push("/");
    }
};
