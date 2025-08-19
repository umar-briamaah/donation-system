'use client';

import { useSimpleAuth } from '../../contexts/SimpleAuthContext';

export default function SimpleAuthTest() {
  const { user, loading, isAuthenticated } = useSimpleAuth();

  return (
    <div className="fixed top-20 left-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Simple Auth Test</h3>
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
          <span className="font-medium">User ID:</span> {user ? user.id : 'null'}
        </div>
        <div>
          <span className="font-medium">User Role:</span> {user ? user.role : 'null'}
        </div>
        <div>
          <span className="font-medium">Raw User:</span> {JSON.stringify(user)}
        </div>
      </div>
    </div>
  );
}
