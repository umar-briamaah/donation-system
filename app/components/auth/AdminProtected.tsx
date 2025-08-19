'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSimpleAuth } from '../../contexts/SimpleAuthContext';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useSimpleAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      // Still loading auth state
      return;
    }

    if (!user) {
      // User not logged in, redirect to login
      router.push('/account/login?redirect=/admin');
      return;
    }

    // Check if user is admin
    if (user.role === 'ADMIN') {
      setIsAuthorized(true);
    } else {
      // User not admin, redirect to dashboard
      router.push('/account/dashboard');
      return;
    }

    setLoading(false);
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
