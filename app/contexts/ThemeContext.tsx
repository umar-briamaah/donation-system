'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always start with light theme to ensure SSR consistency
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  
  // This effect only runs on the client after hydration
  useEffect(() => {
    // Load saved theme from localStorage
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
  }, []);

  // Apply theme changes only after hydration
  useEffect(() => {
    // Skip if we're still on the server
    if (typeof window === 'undefined') return;
    
    const applyTheme = () => {
      try {
        const root = document.documentElement;
        
        if (theme === 'auto') {
          // Use system preference
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const isDark = mediaQuery.matches;
          setResolvedTheme(isDark ? 'dark' : 'light');
          
          // Remove both classes first, then add the appropriate one
          root.classList.remove('light', 'dark');
          if (isDark) {
            root.classList.add('dark');
          } else {
            root.classList.add('light');
          }
        } else {
          // Use manual theme
          const isDark = theme === 'dark';
          setResolvedTheme(isDark ? 'dark' : 'light');
          
          // Remove both classes first, then add the appropriate one
          root.classList.remove('light', 'dark');
          if (isDark) {
            root.classList.add('dark');
          } else {
            root.classList.add('light');
          }
        }
      } catch (error) {
        console.warn('Failed to apply theme:', error);
      }
    };

    applyTheme();
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Save to localStorage only on client
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', newTheme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  };

  // Always provide consistent values during SSR
  const contextValue: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
