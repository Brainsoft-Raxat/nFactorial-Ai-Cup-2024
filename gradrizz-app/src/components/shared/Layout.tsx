// components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import Sidebar from '~/components/shared/Sidebar';
import Header from '~/components/shared/Header';
import { useState } from 'react';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [renderKey, setRenderKey] = useState(0);

  const forceRerender = () => {
    setRenderKey(prevKey => prevKey + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onChatCreated={forceRerender} />
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onChatCreated={forceRerender}/>
        <div className="flex-1 overflow-auto">
          <Outlet key={renderKey}/>
        </div>
      </div>
    </div>
  );
};

export default Layout;
