'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'DONOR';
  phone?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }, []);

  const clearAuthAndRedirect = useCallback(() => {
    console.log('AuthContext: Clearing all authentication data and redirecting to login');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setLoading(false);
    setError(null);
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/account/login';
    }
  }, []);

  const clearTokens = useCallback(() => {
    console.log('AuthContext: Clearing tokens only');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setLoading(false);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('AuthContext: No refresh token found in localStorage');
        throw new Error('No refresh token');
      }

      console.log('AuthContext: Attempting to refresh token...');
      
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      console.log('AuthContext: Refresh response status:', response.status);

      if (response.ok) {
        const { accessToken, user: userData } = await response.json();
        console.log('AuthContext: Token refresh successful, updating localStorage and user state');
        localStorage.setItem('accessToken', accessToken);
        setUser(userData);
      } else {
        const errorData = await response.json();
        console.error('AuthContext: Token refresh failed with status:', response.status, 'Error:', errorData);
        
        // Handle specific error cases
        if (errorData.code === 'TOKEN_MISMATCH' || errorData.requiresReauth) {
          console.log('AuthContext: Token mismatch detected, clearing all tokens and forcing re-auth');
          clearAuthAndRedirect();
          throw new Error('Token mismatch - please login again');
        }
        
        throw new Error(errorData.message || 'Token refresh failed');
      }
    } catch (error) {
      console.error('AuthContext: Token refresh failed:', error);
      
      // Clear tokens on any refresh failure
      clearTokens();
      
      // Don't call logout immediately, let the calling function handle it
      throw error;
    }
  }, [clearAuthAndRedirect, clearTokens]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      console.log('Checking auth status, token:', token ? 'exists' : 'missing');
      
      if (!token) {
        console.log('No token found, setting loading to false');
        setLoading(false);
        return;
      }

      // If we already have a user and a valid token, don't check again
      if (user && token) {
        console.log('User already exists and token is present, skipping auth check');
        setLoading(false);
        return;
      }

      console.log('Token found, validating with /api/auth/me...');
      const response = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      });

      console.log('Auth check response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('Auth check successful, user data:', userData);
        setUser(userData);
        setLoading(false);
      } else if (response.status === 401) {
        console.log('Token expired, attempting refresh');
        try {
          // Token expired, try to refresh
          await refreshToken();
          console.log('Token refresh successful, auth check complete');
          setLoading(false);
        } catch (refreshError) {
          console.error('Token refresh failed during auth check:', refreshError);
          // Clear tokens and user state on refresh failure
          clearTokens();
        }
      } else {
        console.log('Auth check failed with status:', response.status);
        const errorText = await response.text();
        console.log('Error response:', errorText);
        clearTokens();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearTokens();
    }
  }, [user, getAuthHeaders, refreshToken, clearTokens]);

  // Check authentication status on mount
  useEffect(() => {
    console.log('AuthContext - Mounting, checking auth status...');
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Set up token refresh interval
  useEffect(() => {
    if (user) {
      console.log('AuthContext - Setting up token refresh interval for user:', user.name);
      const interval = setInterval(refreshToken, 14 * 60 * 1000); // Refresh every 14 minutes
      return () => clearInterval(interval);
    }
  }, [user, refreshToken]);

  // Debug effect to log state changes
  useEffect(() => {
    console.log('AuthContext - State changed:', { user, loading, isAuthenticated });
    if (user) {
      console.log('AuthContext - User details:', { id: user.id, name: user.name, email: user.email, role: user.role });
    }
  }, [user, loading, isAuthenticated]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      setLoading(true);
      setError(null);
      console.log('Login attempt for:', email);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { accessToken, refreshToken: refreshTokenValue, user: userData } = data;
      
      console.log('Setting tokens and user data:', { accessToken: accessToken ? 'exists' : 'missing', userData });
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshTokenValue);
      
      // Set user state immediately after successful login
      setUser(userData);
      console.log('User state set to:', userData);
      
      // Set loading to false after setting user
      setLoading(false);

      return { success: true, message: 'Login successful', user: userData };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      console.error('Login error:', error);
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
  };

  const register = async (email: string, password: string, name: string, phone?: string): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { accessToken, refreshToken: refreshTokenValue, user: userData } = data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshTokenValue);
      setUser(userData);

      return { success: true, message: 'Registration successful' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: getAuthHeaders(),
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      router.push('/');
    }
  }, [getAuthHeaders, router]);

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Profile update failed');
      }

      setUser(responseData);
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Profile update failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshToken,
    clearError,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
