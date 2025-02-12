import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { PsychologistT } from "@/models/psychologist";
import type { UserType } from "@/models/user";
import type React from "react";
import { BookingCarousel } from "./Carousel";

type BookingDialogProps = {
    profile: PsychologistT | null;
    user: UserType;
    selectedAppointmentTime: string | null;
    setSelectedAppointmentTime: React.Dispatch<
        React.SetStateAction<string | null>
    >;
    isOpen: boolean;
    onClose: () => void;
    t: (args: string) => string;
};

export function BookingDialog({
    isOpen,
    onClose,
    profile,
    selectedAppointmentTime,
    setSelectedAppointmentTime,
    user,
    t,
}: BookingDialogProps) {
    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="h-[80vh] w-full max-w-3xl overflow-hidden border-transparent bg-gradient-to-b from-[#52B788] to-[#128665] p-2">
                <div className="h-full  overflow-y-scroll">
                    <BookingCarousel
                        profile={profile}
                        selectedAppointmentTime={selectedAppointmentTime}
                        setSelectedAppointmentTime={setSelectedAppointmentTime}
                        user={user}
                        t={t}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
