import { db } from "@/firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { CalendarPlusIcon, MailWarningIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface NewMessageIndicatorProps {
    senderUid: string;
    receiverUid: string;
}

export function NewMessageIndicator({
    senderUid,
    receiverUid,
}: NewMessageIndicatorProps) {
    const [newMessages, setNewMessages] = useState(false);

    useEffect(() => {
        const conversationId =
            senderUid < receiverUid
                ? `${senderUid}_${receiverUid}`
                : `${receiverUid}_${senderUid}`;
        const messagesRef = collection(
            db,
            "conversations",
            conversationId,
            "messages",
        );
        const q = query(
            messagesRef,
            where("senderUid", "==", receiverUid),
            where("read", "==", false),
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setNewMessages(querySnapshot.size > 0);
        });

        return () => unsubscribe();
    }, [senderUid, receiverUid]);

    if (!newMessages) return null;

    return (
        <div className="flex size-4 items-center justify-center rounded-full bg-orange-400">
            <MailWarningIcon className="size-3 text-white" />
        </div>
    );
}

export function NewSessionIndicator() {
    return (
        <div className="flex size-4 items-center justify-center rounded-full bg-yellow-400">
            <CalendarPlusIcon className="size-3 text-white" />
        </div>
    );
}
