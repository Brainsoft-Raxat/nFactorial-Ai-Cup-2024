// components/shared/Header.tsx
import { useAuthState } from '~/components/contexts/UserContext';
import SidebarToggleIcon from '~/components/icons/SidebarToggleIcon';
import DummyIcon from '~/components/icons/DummyIcon';
import UserIcon from '~/components/icons/UserIcon';

const Header = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  const { state } = useAuthState();
  const userPhotoURL = state.state === 'SIGNED_IN' ? state.currentUser.photoURL : null;

  return (
    <header className="bg-white text-black p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        {!isOpen && (
          <>
            <SidebarToggleIcon onClick={toggleSidebar} className="cursor-pointer w-8 h-8 mr-4" />
            <DummyIcon className="w-8 h-8" />
          </>
        )}
      </div>
      <div>
        <UserIcon photoURL={userPhotoURL} />
      </div>
    </header>
  );
};

export default Header;
