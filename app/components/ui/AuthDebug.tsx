'use client';

import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import { useState, useEffect } from 'react';

export default function AuthDebug() {
  const { user, loading, isAuthenticated } = useSimpleAuth();
  const [localStorageData, setLocalStorageData] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
  }>({ accessToken: null, refreshToken: null });

  useEffect(() => {
    // Get localStorage data
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    setLocalStorageData({ accessToken, refreshToken });
  }, [user, loading]);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Auth Debug</h3>
      <div className="space-y-2 text-xs">
        <div>
          <span className="font-medium">Loading:</span> {loading ? 'true' : 'false'}
        </div>
        <div>
          <span className="font-medium">Authenticated:</span> {isAuthenticated ? 'true' : 'false'}
        </div>
        <div>
          <span className="font-medium">User:</span> {user ? user.name : 'null'}
        </div>
        <div>
          <span className="font-medium">Access Token:</span> {localStorageData.accessToken ? 'exists' : 'missing'}
        </div>
        <div>
          <span className="font-medium">Refresh Token:</span> {localStorageData.refreshToken ? 'exists' : 'missing'}
        </div>
        <div className="pt-2">
          <button
            onClick={() => {
              console.log('Auth Context State:', { user, loading, isAuthenticated });
              console.log('LocalStorage:', localStorageData);
            }}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
          >
            Log to Console
          </button>
        </div>
      </div>
    </div>
  );
}
