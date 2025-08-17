'use client';

import { useTheme } from '../../contexts/ThemeContext';
import { useState, useEffect } from 'react';

export default function ThemeDebug() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Don't render until client-side
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-xs">
      <div className="space-y-2">
        <div>Theme: {theme}</div>
        <div>Resolved: {resolvedTheme}</div>
        <div>Dark Class: {document.documentElement.classList.contains('dark') ? 'Yes' : 'No'}</div>
        <div>Light Class: {document.documentElement.classList.contains('light') ? 'Yes' : 'No'}</div>
        <div>CSS Variables:</div>
        <div className="pl-2">
          <div>--background: {getComputedStyle(document.documentElement).getPropertyValue('--background')}</div>
          <div>--foreground: {getComputedStyle(document.documentElement).getPropertyValue('--foreground')}</div>
        </div>
      </div>
    </div>
  );
}
