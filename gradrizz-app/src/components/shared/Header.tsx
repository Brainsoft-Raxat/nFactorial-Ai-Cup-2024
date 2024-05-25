import { useAuthState } from '~/components/contexts/UserContext';
import SidebarToggleIcon from '~/components/icons/SidebarToggleIcon';
import CreateChatIcon from '~/components/icons/CreateChatIcon';
import UserIcon from '~/components/icons/UserIcon';
import { useNavigate } from 'react-router-dom';
import GradRizzIcon from '~/components/icons/GradRizzIcon';

const Header = ({ isOpen, toggleSidebar, onChatCreated}: { isOpen: boolean, toggleSidebar: () => void , onChatCreated: () => void}) => {
  const { state } = useAuthState();
  const userPhotoURL = state.state === 'SIGNED_IN' ? state.currentUser.photoURL : null;
  const navigate = useNavigate();

  const handleCreateChat = () => {
    onChatCreated();
    navigate('/chat');
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
      <div>
        <UserIcon photoURL={userPhotoURL} />
      </div>
    </header>
  );
};

export default Header;
