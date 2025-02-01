import ChatInterface from "@/components/profile/Chat";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ChatDialogProps {
    chatProps: {
        senderUid: string;
        receiverUid: string;
        receiverUsername: string;
    };
    setChatProps: (props: {
        senderUid: string;
        receiverUid: string;
        receiverUsername: string;
    }) => void;
    userRole: string;
    t: (args: string) => string;
}

export default function ChatDialog({
    chatProps,
    setChatProps,
    userRole,
    t,
}: ChatDialogProps) {
    return (
        <Dialog
            open={chatProps.senderUid !== ""}
            onOpenChange={() => {
                setChatProps({
                    senderUid: "",
                    receiverUid: "",
                    receiverUsername: "",
                });
            }}
        >
            <DialogContent
                className={cn(
                    "max-w-[550px] bg-gradient-to-b",
                    userRole === "psychologist"
                        ? "from-[#40916C] to-[#52B788]"
                        : "from-[#F7F4E0] to-[#F1ECCC]",
                )}
            >
                <ChatInterface
                    t={t}
                    senderUid={chatProps.senderUid}
                    receiverUid={chatProps.receiverUid}
                    receiverUsername={chatProps.receiverUsername}
                />
            </DialogContent>
        </Dialog>
    );
}
