'use client';

import dynamicImport from 'next/dynamic';

// Dynamically import components with no SSR to avoid useAuth errors
const SimpleNavigation = dynamicImport(() => import('../../components/layout/SimpleNavigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-800" />
});

const Footer = dynamicImport(() => import('../../components/layout/Footer'), {
  ssr: false
});

const DashboardContent = dynamicImport(() => import('./DashboardContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  )
});

// Prevent prerendering
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation />
      <DashboardContent />
      <Footer />
    </div>
  );
}
