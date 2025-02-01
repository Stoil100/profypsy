import type { AppointmentT } from "@/models/appointment";
import type { PsychologistT } from "@/models/psychologist";

export type ProfileT = PsychologistT & AppointmentT;
