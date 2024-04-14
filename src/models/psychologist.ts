import { AppointmentT } from "./appointment";

type PsychologistT ={
    phone: string;
    age: string;
    about: string;
    quote: string;
    cost: {
        dates: string[];
        price: string;
    };
    educations: {
        education: string;
    }[];
    experiences: {
        experience: string;
    }[];
    userName: string;
    location: string;
    image?:string | null;
    cv:any;
    letter:any;
    specializations:string[];
    languages:string[];
    diploma: any;
    email: string;
    variant?: "Basic" | "Premium" | "Deluxe";
    duration: "Monthly" | "Yearly";
    rating: number;
    trial: boolean;
    approved: boolean;
    uid: string;
    appointments:AppointmentT[];
}

export type {PsychologistT};