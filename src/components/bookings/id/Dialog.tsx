import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PsychologistT } from "@/models/psychologist";
import { UserType } from "@/models/user";
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
            <DialogContent className="h-fit w-full max-w-3xl border-transparent bg-gradient-to-b from-[#52B788] to-[#128665] p-2">
                <BookingCarousel
                    profile={profile}
                    selectedAppointmentTime={selectedAppointmentTime}
                    setSelectedAppointmentTime={setSelectedAppointmentTime}
                    user={user}
                    t={t}
                />
            </DialogContent>
        </Dialog>
    );
}
