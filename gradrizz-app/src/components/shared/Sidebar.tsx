// components/shared/Sidebar.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarToggleIcon from '~/components/icons/SidebarToggleIcon';
import CreateChatIcon from '~/components/icons/CreateChatIcon';
import ChatList from '~/components/shared/ChatList';

const Sidebar = ({ isOpen, toggleSidebar, onChatCreated}: { isOpen: boolean, toggleSidebar: () => void, onChatCreated: () => void}) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreateChat = () => {
    navigate('/chat');
    onChatCreated();
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out bg-gray-200 text-black w-64 p-4`}
    >
      {isOpen && (
        <>
          <div className="flex justify-between items-center mb-4">
            <SidebarToggleIcon onClick={toggleSidebar} className="cursor-pointer w-8 h-8" />
            <CreateChatIcon className="cursor-pointer w-8 h-8" onClick={handleCreateChat} />
          </div>
          <ChatList toggleSidebar={toggleSidebar} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
        </>
      )}
    </div>
  );
};

export default Sidebar;
