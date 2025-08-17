'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Menu, X, User, Home, Info, HelpCircle, BarChart3, LogOut } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you'd validate the token with your API
      // For now, we'll use mock data based on stored email
      const storedEmail = localStorage.getItem('userEmail');
      let mockUser;
      
      if (storedEmail === 'admin@givehopegh.org') {
        mockUser = {
          name: 'Admin User',
          email: 'admin@givehopegh.org',
          role: 'ADMIN'
        };
      } else {
        mockUser = {
          name: 'John Doe',
          email: 'john@example.com',
          role: 'DONOR'
        };
      }
      
      setUser(mockUser);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setUser(null);
    router.push('/');
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Causes', href: '/causes', icon: Heart },
    { name: 'About', href: '/about', icon: Info },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Impact', href: '/impact', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Give Hope</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                    </div>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Admin
                      </Link>
                    )}
                                         <Link
                       href="/account/dashboard"
                       className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                     >
                       Dashboard
                     </Link>
                     <Link
                       href="/account/settings"
                       className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                     >
                       Settings
                     </Link>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/account/login"
                      className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/account/register"
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{user.name}</span>
                        </div>
                      </div>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                                             <Link
                         href="/account/dashboard"
                         className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium"
                         onClick={() => setIsMenuOpen(false)}
                       >
                         My Dashboard
                       </Link>
                       <Link
                         href="/account/settings"
                         className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium"
                         onClick={() => setIsMenuOpen(false)}
                       >
                         Settings
                       </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/account/login"
                        className="text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/account/register"
                        className="bg-red-500 hover:bg-red-600 block px-3 py-2 rounded-md text-base font-medium text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
