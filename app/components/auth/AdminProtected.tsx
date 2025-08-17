'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
      // User not logged in, redirect to login
      router.push('/account/login?redirect=/admin');
      return;
    }

    // In a real app, you'd validate the token with your API
    // For now, we'll use mock data to check if user is admin
    // This is a simplified check - in production, validate the token server-side
    try {
      // Check user role from stored email
      const storedEmail = localStorage.getItem('userEmail');
      
      if (storedEmail === 'admin@givehopegh.org') {
        // User is admin
        setIsAuthorized(true);
      } else {
        // User not admin, redirect to dashboard
        router.push('/account/dashboard');
        return;
      }
    } catch {
      // Token validation failed, redirect to login
      router.push('/account/login?redirect=/admin');
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
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
