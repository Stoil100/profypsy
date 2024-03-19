// components/Chat.tsx
import { useEffect, useState } from 'react';
import { db } from '@/firebase/config';
import { collection, addDoc, query, where, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';

interface Message {
  id: string;
  text: string;
  createdAt: any;
  uid: string;
}

interface ChatProps {
  senderUid: string;
  receiverUid: string;
}

const Chat = ({ senderUid, receiverUid }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("uid", "in", [senderUid, receiverUid]),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedMessages: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        loadedMessages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(loadedMessages as Message[]);
    });

    return unsubscribe; // Make sure we unsubscribe on component unmount
  }, [senderUid, receiverUid]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;
    const messagesRef = collection(db, "messages");
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: new Date(),
      uid: senderUid
    });
    setNewMessage('');
  };

  return (
    <div>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>{message.text}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
