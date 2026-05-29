import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

function Layout({ showAlert }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', newState);
  };

  const desktopSidebarWidth = isCollapsed ? 'w-20' : 'w-64';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar - desktop always visible, mobile drawer */}
      <div className={`fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${desktopSidebarWidth}`}>
        <Sidebar 
          onClose={() => setSidebarOpen(false)} 
          isMobile={isMobile} 
          isCollapsed={isCollapsed} 
          toggleCollapse={toggleCollapse} 
        />
      </div>
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content - no margin, just flex-1 */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{ showAlert }} />
        </main>
      </div>
    </div>
  );
}

export default Layout;