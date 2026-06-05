import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome, FiPackage, FiGrid, FiShoppingCart, FiUsers,
  FiUploadCloud, FiSettings, FiX, FiLogOut, FiChevronLeft, FiChevronRight,
  FiUserPlus
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { path: '/', name: 'Dashboard', icon: FiHome },
  { path: '/products', name: 'Products', icon: FiPackage },
  // { path: '/categories', name: 'Categories', icon: FiGrid },
  // { path: '/orders', name: 'Orders', icon: FiShoppingCart },
  // { path: '/customers', name: 'Customers', icon: FiUsers },
  { path: '/upload', name: 'Upload Clothes', icon: FiUploadCloud },
  { path: '/user-management', name: 'User Management', icon: FiUserPlus },
  { path: '/settings', name: 'Settings', icon: FiSettings },
];

function Sidebar({ onClose, isMobile, isCollapsed, toggleCollapse }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const collapsed = isMobile ? false : isCollapsed;

  return (
    <div className={`
      h-full flex flex-col transition-all duration-300
      ${collapsed ? 'w-20' : 'w-64'} 
      bg-white dark:bg-gray-900 shadow-2xl dark:shadow-yellow-50 outline-none rounded-lg
      border-r border-gray-200 dark:border-gray-800
    `}>
      {/* Header with logo and toggle */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-white">Clothify</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 p-2 bg-primary-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">C</span>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="text-gray-700 dark:text-gray-300 pt-2 pb-2 ml-2 rounded-lg bg-white dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => isMobile && onClose()}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? item.name : ''}
          >
            <item.icon size={20} />
            {!collapsed && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer with logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full
            text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white
            ${collapsed ? 'justify-center' : ''}
          `}
          title={collapsed ? 'Logout' : ''}
        >
          <FiLogOut size={20} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
        {!collapsed && (
          <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
            © 2024 Clothify Store
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
