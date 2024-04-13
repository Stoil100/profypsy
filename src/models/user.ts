import { AppointmentT } from "@/app/[locale]/(logic)/search/[id]/page";

type UserType ={
    email: string | null;
    uid: string | null;
    role: "user" | "psychologist" | null;
    appointments: AppointmentT[] | null;
    userName:string | null;
    image:string | null;
    phone:string | null;
    admin: boolean | null;
}

export type {UserType};