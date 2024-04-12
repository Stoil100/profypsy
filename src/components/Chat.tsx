// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { useEffect, useState } from 'react';
// import { collection, addDoc, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
// import { db } from '@/firebase/config';

import { db } from "@/firebase/config";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CollectionReference,
    DocumentReference,
    UpdateData,
    addDoc,
    collection,
    doc,
    limit,
    onSnapshot,
    orderBy,
    writeBatch,
    query,
    DocumentData,
    Timestamp,
    getDoc,
    setDoc
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "./Providers";

const formSchema = z.object({
  message: z.string().min(1,"Please enter a valid message")
})
type ChatProps = {
    senderUid: string;
    receiverUid: string;
    receiverUsername: string,
};
interface Message {
    // Define the structure of your message object
    content: string;
    timestamp: Date;
    senderUid: string;
}
export default function Chat({ senderUid, receiverUid,receiverUsername }: ChatProps) {
    const {user}=useAuth();
  const [messages,setMessages]=useState<Message[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })
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
        const conversationId: string = getConversationId(senderUid, receiverUid);
    
        const messageRef = collection(db, "conversations", conversationId, "messages");
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
            await setDoc(conversationDocRef, { lastMessage: newMessage }, { merge: true });
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
    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 p-2"
            >
                <h2 className="text-2xl">
                    Private chat with {receiverUsername}
                </h2>
                <div className="flex max-h-[50vh] flex-col gap-2 overflow-y-auto rounded-xl border bg-white p-2">
                    {messages.map((message, index) => (
                        <p
                            key={index}
                            className={cn(
                                "min-w-[50px] break-all rounded-2xl px-2 text-xl",
                                user.role === "psychologist"
                                    ? message.senderUid === senderUid
                                        ? "self-end bg-[#40916C] text-right text-white"
                                        : "self-start border-2 border-[#40916C] text-left text-[#40916C]"
                                    : message.senderUid === senderUid
                                      ? "self-end bg-[#40916C] text-right text-white"
                                      : "self-start border-2 border-[#40916C] text-right text-[#40916C]",
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
