// components/shared/Sidebar.tsx
import { Link } from 'react-router-dom';
import SidebarToggleIcon from '~/components/icons/SidebarToggleIcon';
import DummyIcon from '~/components/icons/DummyIcon';

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out bg-gray-200 text-black w-64 p-4`}
    >
      {isOpen && (
        <>
          <div className="flex justify-between items-center mb-4">
            <SidebarToggleIcon onClick={toggleSidebar} className="cursor-pointer w-8 h-8" />
            <DummyIcon className="w-8 h-8" />
          </div>
          <ul>
            <li className="mb-2">
              <Link to="/" className="text-black hover:text-gray-600" onClick={toggleSidebar}>
                Home
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/chat" className="text-black hover:text-gray-600" onClick={toggleSidebar}>
                Chat
              </Link>
            </li>
          </ul>
        </>
      )}
    </div>
  );
};

export default Sidebar;
