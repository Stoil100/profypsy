import { AppointmentT } from "./appointment";
type UserType = {
    email: string | null;
    uid: string | null;
    role: "user" | "psychologist" | null;
    appointments: AppointmentT[] | null;
    userName: string | null;
    image: string | null;
    phone: string | null;
    admin: boolean | null;
};

export type { UserType };
