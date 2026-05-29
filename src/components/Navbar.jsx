import React from 'react';
import { FiMenu, FiBell, FiUser, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth(); // get logged-in user

  // Extract display name (e.g., "Admin" or first part of email)
  const displayName = user?.email?.split('@')[0] || 'Admin';
  const displayEmail = user?.email || 'admin@clothify.com';

  return (
    <header className="bg-transparent border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiMenu size={22} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex-1 lg:flex-none">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Theme toggle */}
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            {theme === 'light' ? <FiMoon size={20} className="text-gray-700" /> : <FiSun size={20} className="text-yellow-400" />}
          </button>
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiBell size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {/* User info (dynamic) */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-medium">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{displayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{displayEmail}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;