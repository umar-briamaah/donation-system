'use client';

import { useEffect, useState } from 'react';
import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import RegisterForm from './RegisterForm';

export default function RegisterClient() {
  const [mounted, setMounted] = useState(false);
  const auth = useSimpleAuth(); // Always call the hook
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
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
  
  return <RegisterForm auth={auth} />;
}
