'use client';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import RegisterClient from './RegisterClient';

export default function RegisterPage() {
  return <RegisterClient />;
}
