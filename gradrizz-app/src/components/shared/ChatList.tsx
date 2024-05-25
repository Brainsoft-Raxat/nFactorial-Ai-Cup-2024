// src/components/shared/ChatList.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getChats } from '~/lib/firestoreService';
import { useAuthState } from '~/components/contexts/UserContext';

interface Chat {
  id: string;
  title: string;
}

interface ChatListProps {
  toggleSidebar: () => void;
  selectedChatId: string | null;
  setSelectedChatId: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ toggleSidebar, selectedChatId, setSelectedChatId }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const { state } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (state.state === 'SIGNED_IN') {
          const fetchedChats = await getChats(state.currentUser!.uid);
          setChats(fetchedChats);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [state]);

  const handleChatClick = (chatId: string) => {
    setSelectedChatId(chatId);
    toggleSidebar();
    navigate(`/chat/${chatId}`);
  };

  return (
    <ul>
      {chats.length === 0 ? (
        <li>No chats available. Create a new chat to start.</li>
      ) : (
        chats.map(chat => (
          <li
            key={chat.id}
            className={`mb-2 p-2 rounded ${chat.id === selectedChatId ? 'bg-gray-300 text-black' : 'text-black'}`}
            onClick={() => handleChatClick(chat.id)}
          >
            {chat.title}
          </li>
        ))
      )}
    </ul>
  );
};

export default ChatList;
