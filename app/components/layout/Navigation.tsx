'use client';

import Link from 'next/link';
import { useState, useEffect, memo } from 'react';
import { Heart, Menu, X, User, Home, Info, HelpCircle, BarChart3, LogOut, Settings } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import UserMenu from './UserMenu';
import NotificationBell from './NotificationBell';

const Navigation = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const { user, logout, loading } = useSimpleAuth();

  // Debug authentication state
  useEffect(() => {
    console.log('Navigation - Auth state:', { user, loading, isAuthenticated: !!user });
    console.log('Navigation - User object:', user);
    console.log('Navigation - Loading state:', loading);
    
    // Force re-render when auth state changes
    setForceUpdate(prev => prev + 1);
  }, [user, loading]);

  // Additional debug effect to track re-renders
  useEffect(() => {
    console.log('Navigation component re-rendered, forceUpdate:', forceUpdate);
  });

  // Handle scroll effect for modern sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Causes', href: '/causes', icon: Heart },
    { name: 'About', href: '/about', icon: Info },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Impact', href: '/impact', icon: BarChart3 },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
        : 'bg-white dark:bg-gray-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Heart className="h-8 w-8 lg:h-10 lg:w-10 text-red-500 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg group-hover:bg-red-500/30 transition-all duration-300"></div>
              </div>
              <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Give Hope
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 group"
              >
                <span className="flex items-center space-x-2">
                  <item.icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </span>
                <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            <NotificationBell />
            
            <ThemeToggle />
            
            {!loading && (
              <>
                {user ? (
                  <UserMenu user={user} onLogout={handleLogout} />
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/account/login"
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/account/register"
                      className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                      Welcome, {user.name}
                    </div>
                    <Link
                      href="/account/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/account/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/account/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 bg-red-500 text-white rounded-lg text-center font-medium hover:bg-red-600 transition-colors duration-200"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
