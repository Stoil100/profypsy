type ListProfile = {
    name?: string;
    about?: string;
    location?: string;
    picture?: string;
    experience?: string[];
    education?:string[];
    specialization?: string[];
    quote?: string;
    cost?:{
        time:string;
        price:string;
    }
    languages?:string[];
    variant?:string;
    uid?:string;
};

type ListProfiles = {
    ultra: ListProfile[];
    premium: ListProfile[];
    trial: ListProfile[];
    basic: ListProfile[];
};

export type {ListProfile,ListProfiles}