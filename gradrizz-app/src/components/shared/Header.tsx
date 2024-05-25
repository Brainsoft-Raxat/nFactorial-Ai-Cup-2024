// components/shared/Header.tsx
import { useState } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import SidebarToggleIcon from '~/components/icons/SidebarToggleIcon';
import CreateChatIcon from '~/components/icons/CreateChatIcon';
import UserIcon from '~/components/icons/UserIcon';
import { useNavigate } from 'react-router-dom';
import GradRizzIcon from '~/components/icons/GradRizzIcon';
import { useAuth } from '~/lib/firebase'; // Import useAuth

const Header = ({ isOpen, toggleSidebar, onChatCreated }: { isOpen: boolean, toggleSidebar: () => void, onChatCreated: () => void }) => {
  const { state } = useAuthState();
  const userPhotoURL = state.state === 'SIGNED_IN' ? state.currentUser.photoURL : null;
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const auth = useAuth(); // Initialize auth

  const handleCreateChat = () => {
    onChatCreated();
    navigate('/chat');
  };

  const handleUserIconClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white text-black p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        {!isOpen && (
          <>
            <SidebarToggleIcon onClick={toggleSidebar} className="cursor-pointer w-8 h-8 mr-4" />
            <CreateChatIcon className="cursor-pointer w-8 h-8" onClick={handleCreateChat} />
          </>
        )}
      </div>
      <div>
        <GradRizzIcon height={50} fill="blue" />
      </div>
      <div className="relative">
        <UserIcon photoURL={userPhotoURL} onClick={handleUserIconClick} />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <ul>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/profile')}
              >
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
