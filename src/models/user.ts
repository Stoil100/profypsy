import { AppointmentT } from "@/app/(logic)/search/[id]/page";

type UserType ={
    email: string | null;
    uid: string | null;
    role: string | null;
    appointments: AppointmentT[] | null;
}

export type {UserType};