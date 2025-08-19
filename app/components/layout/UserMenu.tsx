'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, ChevronDown, Shield, Activity } from 'lucide-react';

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
      >
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                <div className="flex items-center space-x-1 mt-1">
                  <Shield className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/account/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Activity className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              href="/account/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            
            <Link
              href="/account/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>

            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-t border-gray-200 dark:border-gray-700 mt-2 pt-2"
              >
                <Shield className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
