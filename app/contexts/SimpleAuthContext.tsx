'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (
    email: string,
    password: string,
    name?: string,
    phone?: string
  ) => Promise<{ success: boolean; message?: string; user?: User }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => void;
}

const SimpleAuthContext = createContext<AuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials
      if (email === 'admin@givehopegh.org' && password === 'admin123') {
        const userData: User = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@givehopegh.org',
          role: 'ADMIN',
          phone: '+233 20 123 4567',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        return {
          success: true,
          user: userData
        };
      } else {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  };

  const register = async (
    email: string,
    password: string,
    name?: string,
    phone?: string
  ) => {
    // Simulate registration by creating a user and logging in
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // For demo: only allow admin demo account to succeed
      if (email === 'admin@givehopegh.org' && password === 'admin123') {
        const userData: User = {
          id: 'admin-1',
          name: name || 'Admin User',
          email,
          role: 'ADMIN',
          phone: phone || '+233 20 123 4567',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));

        return { success: true, user: userData };
      }

      return { success: false, message: 'Registration is disabled in demo' };
    } catch (error) {
      return { success: false, message: 'An error occurred during registration' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    register,
    login,
    logout
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}
