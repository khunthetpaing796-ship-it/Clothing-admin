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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Store settings – load from localStorage
  const [storeSettings, setStoreSettings] = useState(() => {
    const saved = localStorage.getItem('storeSettings');
    return saved
      ? JSON.parse(saved)
      : {
          storeName: '',
          adminName: '',
          adminEmail: '',
          currency: '',
          lowStockAlert: 10,
          address: '',
          phone: '',
        };
  });

  // Persist settings changes
  useEffect(() => {
    localStorage.setItem('storeSettings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  // Responsive logic
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const effectiveCollapsed = isTablet ? true : (isDesktop ? isCollapsed : false);

  const toggleCollapse = () => {
    if (isDesktop) {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      localStorage.setItem('sidebarCollapsed', newState);
    }
  };

  const desktopSidebarWidth = effectiveCollapsed ? 'w-20' : 'w-64';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${desktopSidebarWidth}
      `}>
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
          isCollapsed={effectiveCollapsed}
          toggleCollapse={toggleCollapse}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{ showAlert, storeSettings, setStoreSettings }} />
        </main>
      </div>
    </div>
  );
}

export default Layout;
