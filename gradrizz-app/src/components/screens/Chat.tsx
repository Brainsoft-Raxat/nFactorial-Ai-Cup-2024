// Chat.tsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthState } from '~/components/contexts/UserContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Head } from '~/components/shared/Head';
import UserIcon from '~/components/icons/UserIcon';
import BotIcon from '~/components/icons/BotIcon';
import { addMessage, getMessages, createChat } from '~/lib/firestoreService';
import { createChatTitle, sendMessage } from '~/services/api'; // Import the new API functions
import './scrollbar.css'; // Import custom scrollbar styles

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { state } = useAuthState();
  const navigate = useNavigate();
  const userPhotoURL = state.state === 'SIGNED_IN' ? state.currentUser?.photoURL : null;

  useEffect(() => {
    if (chatId) {
      return getMessages(chatId, setMessages);
    }
  }, [chatId]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsTyping(true);

    let currentChatId = chatId;
    if (!currentChatId) {
      try {
        // Generate a chat title based on the initial message
        const title = await createChatTitle(input);
        // Create a new chat with the generated title
        currentChatId = await createChat(state.currentUser!.uid, title);
        navigate(`/chat/${currentChatId}`);
      } catch (error) {
        console.error('Error creating chat:', error);
        setIsTyping(false);
        return;
      }
    }

    try {
      const stream = await sendMessage(input);

      const reader = stream.getReader();
      const decoder = new TextDecoder('utf-8');

      let done = false;
      let botMessage = '';
      const newMessages = [...messages, { sender: 'user', text: input }];

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        botMessage += chunkValue;
        setMessages([...newMessages, { sender: 'bot', text: botMessage }]);
      }
      setIsTyping(false);

      await addMessage(currentChatId!, 'user', input);
      await addMessage(currentChatId!, 'bot', botMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = '**Bot**: Error communicating with server.';
      setMessages([...messages, { sender: 'bot', text: errorMessage }]);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const renderers = useMemo(() => ({
    h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-2xl font-bold">{children}</h1>,
    h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-xl font-semibold">{children}</h2>,
    h3: ({ children }: { children: React.ReactNode }) => <h3 className="text-lg font-medium">{children}</h3>,
    p: ({ children }: { children: React.ReactNode }) => <p className="mb-2">{children}</p>,
    li: ({ children }: { children: React.ReactNode }) => <li className="list-disc list-inside">{children}</li>,
  }), []);

  return (
    <div className="flex items-center justify-center h-full p-4">
      <Head title="Chat" />
      <div className="flex flex-col w-6/12 h-full max-w-3xl p-4">
        <div
          className="flex-1 overflow-y-scroll mb-4 p-2 rounded no-scrollbar"
          ref={messageContainerRef}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start mb-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && <BotIcon className="w-6 h-6 mr-2" />}
              <div className={`p-2 rounded max-w-max ${message.sender === 'user' ? 'bg-gray-100 ml-auto' : ''}`} style={{ display: 'inline-block', maxWidth: '75%' }}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={renderers}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
              {message.sender === 'user' && <UserIcon photoURL={userPhotoURL} />}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start mb-2 justify-start">
              <BotIcon className="w-6 h-6 mr-2" />
              <div className="p-2 rounded max-w-max " style={{ display: 'inline-block', maxWidth: '75%' }}>
                <div className="blink">...</div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded mr-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
          />
          <button className="p-2 bg-blue-500 text-white rounded" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
