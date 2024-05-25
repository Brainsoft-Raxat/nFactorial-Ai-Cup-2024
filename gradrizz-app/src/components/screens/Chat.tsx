// components/screens/Chat.tsx
import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useSignIn, useSignOut, useAuthState } from '~/components/contexts/UserContext';
import { Head } from '~/components/shared/Head';
import Sidebar from '~/components/shared/Sidebar';
import Header from '~/components/shared/Header';

const Chat = () => {
  const { state } = useAuthState();
  const [messages, setMessages] = useState<string>('');
  const [input, setInput] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = `**User**: ${input}\n\n`;
    setMessages((prevMessages) => prevMessages + userMessage);
    setInput('');

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.body) {
        throw new Error('ReadableStream not yet supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let done = false;
      let botMessage = '**Bot**: ';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        botMessage += chunkValue;
        setMessages((prevMessages) => prevMessages + chunkValue);
      }
      setMessages((prevMessages) => prevMessages + botMessage + '\n\n');
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = `**Bot**: Error communicating with server.\n\n`;
      setMessages((prevMessages) => prevMessages + errorMessage);
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex items-center justify-center h-full bg-gray-100">
          <Head title="Chat" />
          <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
            <div className="mb-4">
              <h1 className="text-xl font-bold">Chat</h1>
            </div>
            <div
              className="h-80 overflow-y-scroll mb-4 p-2 border border-gray-300 rounded"
              ref={messageContainerRef}
            >
              <ReactMarkdown>{messages}</ReactMarkdown>
            </div>
            <div className="flex">
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
      </div>
    </div>
  );
};

export default Chat;
