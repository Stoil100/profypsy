import { toast } from "@/components/ui/use-toast";
import { db } from "@/firebase/config";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

export const updateAppointment = async (
    psychologistUid: string,
    userUid: string,
    psychologistAppointment: any,
    userAppointment: any,
) => {
    const psychologistProfileDocRef = doc(db, "psychologists", psychologistUid);
    const userProfileDocRef = doc(db, "users", userUid);

    try {
        await updateDoc(psychologistProfileDocRef, {
            appointments: arrayUnion(psychologistAppointment),
        });
        await updateDoc(userProfileDocRef, {
            appointments: arrayUnion(userAppointment),
        });
        toast({
            title: "Appointment Scheduled",
            description: `${psychologistAppointment.selectedDate}`,
        });
        return true;
    } catch (error) {
        console.error("Error adding appointment: ", error);
        toast({
            title: "Error",
            description: "Failed to schedule appointment",
            variant: "destructive",
        });
        return false;
    }
};
