'use client';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useTheme } from '../contexts/ThemeContext';
import ThemeDebug from '../components/ui/ThemeDebug';
import { useState, useEffect } from 'react';

export default function TestThemePage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render theme-dependent content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Theme Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Current Theme: {theme}</h2>
          
          <div className="space-y-2">
            <button
              onClick={() => setTheme('light')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Set Light Theme
            </button>
            
            <button
              onClick={() => setTheme('dark')}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 ml-2"
            >
              Set Dark Theme
            </button>
            
            <button
              onClick={() => setTheme('auto')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
            >
              Set Auto Theme
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Theme Indicators</h3>
          <div className="space-y-2 text-sm">
            <div>Document has &apos;dark&apos; class: {document.documentElement.classList.contains('dark') ? 'Yes' : 'No'}</div>
            <div>Document has &apos;light&apos; class: {document.documentElement.classList.contains('light') ? 'Yes' : 'No'}</div>
            <div>Background color: {getComputedStyle(document.documentElement).getPropertyValue('--background')}</div>
            <div>Text color: {getComputedStyle(document.documentElement).getPropertyValue('--foreground')}</div>
          </div>
        </div>
      </div>
      
      <ThemeDebug />
    </div>
  );
}
