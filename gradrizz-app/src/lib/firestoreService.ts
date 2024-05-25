// firestoreService.ts
import { collection, addDoc, setDoc, doc, getDocs, query, orderBy, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from './firebase';
import { setupFirebase } from './firebase';

setupFirebase();

const db = useFirestore();

interface User {
  uid: string;
  username: string;
  email: string;
  profilePictureUrl: string;
}

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: any;
}

interface Chat {
    id: string;
    ownerId: string;
    title: string;
    createdAt: any;
  }

const addUser = async (user: User) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      username: user.username,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding user: ", error);
    throw new Error('Could not add user');
  }
};

const createChat = async (ownerId: string, title: string): Promise<string> => {
  try {
    const chatRef = await addDoc(collection(db, 'chats'), {
      ownerId,
      title,
      createdAt: serverTimestamp(),
    });
    return chatRef.id;
  } catch (error) {
    console.error("Error creating chat: ", error);
    throw new Error('Could not create chat');
  }
};

const addMessage = async (chatId: string, sender: string, text: string) => {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      sender,
      text,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding message: ", error);
    throw new Error('Could not add message');
  }
};

const getMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp'));
    return onSnapshot(q, (querySnapshot) => {
      const messages: Message[] = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data() as Message);
      });
      callback(messages);
    });
  } catch (error) {
    console.error("Error getting messages: ", error);
  }
};

const getChats = async (userId: string): Promise<Chat[]> => {
    try {
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const chats = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Chat));
      return chats;
    } catch (error) {
      console.error("Error getting chats: ", error);
      throw new Error('Could not get chats');
    }
  };
  
export { addUser, createChat, addMessage, getMessages, getChats };
