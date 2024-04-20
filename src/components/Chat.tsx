// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { useEffect, useState } from 'react';
// import { collection, addDoc, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
// import { db } from '@/firebase/config';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase/config";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    DocumentReference,
    Timestamp,
    addDoc,
    collection,
    doc,
    getDoc,
    limit,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    writeBatch,
} from "firebase/firestore";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type ChatProps = {
    senderUid: string;
    receiverUid: string;
    receiverUsername: string;
};
interface Message {
    content: string;
    timestamp: Date;
    senderUid: string;
}
export default function Chat({
    senderUid,
    receiverUid,
    receiverUsername,
}: ChatProps) {
    const t = useTranslations("Profile.chat");
    const [messages, setMessages] = useState<Message[]>([]);
    const formSchema = z.object({
        message: z.string().min(1, t("error")),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        },
    });
    function getConversationId(senderUid: string, receiverUid: string) {
        return senderUid < receiverUid
            ? `${senderUid}_${receiverUid}`
            : `${receiverUid}_${senderUid}`;
    }

    useEffect(() => {
        // Listen for new messages when a user is selected
        const conversationId = getConversationId(senderUid, receiverUid);
        const messagesRef = collection(
            db,
            "conversations",
            conversationId,
            "messages",
        );
        const q = query(messagesRef, orderBy("createdAt"), limit(50));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                // Ensure the data matches the Message interface. Adjust as necessary for your data structure.
                const message: Message = {
                    content: data.content,
                    timestamp: data.timestamp, // Convert Firestore Timestamp to Date
                    senderUid: data.senderUid, //
                };
                return {
                    ...message,
                };
            });
            setMessages(messages);
        });
        return () => unsubscribe();
    }, [db, senderUid, receiverUid]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const conversationId: string = getConversationId(
            senderUid,
            receiverUid,
        );

        const messageRef = collection(
            db,
            "conversations",
            conversationId,
            "messages",
        );
        const newMessage = {
            senderUid: senderUid,
            content: values.message,
            createdAt: Timestamp.now(),
        };

        try {
            await addDoc(messageRef, newMessage);
        } catch (error) {
            console.error(error);
        }
        const batch = writeBatch(db);

        // Update the last message in the conversation
        const conversationDocRef = doc(db, "conversations", conversationId); // Fixed line
        const docSnap = await getDoc(conversationDocRef);
        if (!docSnap.exists()) {
            // Document does not exist, create it first
            await setDoc(
                conversationDocRef,
                { lastMessage: newMessage },
                { merge: true },
            );
        } else {
            // Document exists, update it
            batch.update(conversationDocRef, { lastMessage: newMessage });
        }

        const userUpdate = {
            [`conversations.${conversationId}`]: newMessage,
        };

        const senderDocRef: DocumentReference = doc(db, "users", senderUid);
        const receiverDocRef: DocumentReference = doc(db, "users", receiverUid); // Fixed line
        batch.update(senderDocRef, userUpdate);
        batch.update(receiverDocRef, userUpdate);

        form.reset();
        try {
            await batch.commit();
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 p-2"
            >
                <h2 className="text-2xl">
                    {t("privateChat")} {receiverUsername}
                </h2>
                <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto rounded-xl border bg-white p-2">
                    {messages!.map((message, index) => (
                        <p
                            key={index}
                            className={cn(
                                "min-w-[50px] max-w-[90%] break-all rounded-2xl px-2 text-xl",
                                message.senderUid === senderUid
                                    ? "self-end bg-[#40916C] text-right text-white"
                                    : "self-start border-2 border-[#40916C] text-left text-[#40916C]",
                            )}
                        >
                            {message.content}
                        </p>
                    ))}
                </div>
                <div className="flex gap-2">
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input
                                        placeholder="message..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        variant="outline"
                        className="text-[#40916C]"
                    >
                        <Send />
                    </Button>
                </div>
            </form>
        </Form>
    );
}
