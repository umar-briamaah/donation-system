'use client';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';
export const ssr = false;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Settings, 
  LogOut, 
  Plus,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface Donation {
  id: string;
  amount: number;
  currency: string;
  cause: {
    title: string;
    category: string;
  };
  donatedAt: string;
  status: string;
}

// Client-only wrapper component to prevent SSR issues
function DashboardContent() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    thisMonth: 0,
    favoriteCause: 'None yet'
  });

  const { user, logout, loading } = useAuth();

  // Define fetchUserData function before using it in useEffect
  const fetchUserData = async () => {
    try {
      // In a real app, you'd fetch this from your API
      // For now, we'll use mock data
      const mockDonations: Donation[] = [
        {
          id: '1',
          amount: 50,
          currency: 'GHS',
          cause: { title: 'Clean Water for Rural Communities', category: 'Health & Sanitation' },
          donatedAt: '2024-01-15',
          status: 'COMPLETED'
        },
        {
          id: '2',
          amount: 100,
          currency: 'GHS',
          cause: { title: 'Education for Underprivileged Children', category: 'Education' },
          donatedAt: '2024-01-10',
          status: 'COMPLETED'
        },
        {
          id: '3',
          amount: 75,
          currency: 'GHS',
          cause: { title: 'Medical Supplies for Rural Clinic', category: 'Healthcare' },
          donatedAt: '2024-01-05',
          status: 'COMPLETED'
        }
      ];

      setRecentDonations(mockDonations);

      // Mock stats
      setStats({
        totalDonations: mockDonations.length,
        totalAmount: mockDonations.reduce((sum, d) => sum + d.amount, 0),
        thisMonth: mockDonations.filter(d => {
          const donationDate = new Date(d.donatedAt);
          const now = new Date();
          return donationDate.getMonth() === now.getMonth() && 
                 donationDate.getFullYear() === now.getFullYear();
        }).reduce((sum, d) => sum + d.amount, 0),
        favoriteCause: 'Clean Water for Rural Communities'
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Fetch user's donation data
      fetchUserData();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Don't render auth-dependent content until mounted
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here&apos;s what&apos;s happening with your donations and impact
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/account/settings"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDonations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">₵{stats.totalAmount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">₵{stats.thisMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Favorite Cause</p>
                <p className="text-lg font-semibold text-gray-900">{stats.favoriteCause}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Donations */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Donations</h2>
                  <Link
                    href="/account/donations"
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    View all
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentDonations.length > 0 ? (
                  recentDonations.map((donation) => (
                    <div key={donation.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {donation.cause.title}
                          </h3>
                          <p className="text-sm text-gray-500">{donation.cause.category}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(donation.donatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ₵{donation.amount}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            donation.status === 'COMPLETED' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {donation.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <Heart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No donations yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start making a difference by donating to a cause you care about.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/causes"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Causes
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Profile */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/causes"
                  className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Plus className="h-5 w-5 mr-3 text-red-600" />
                  Make a Donation
                </Link>
                <Link
                  href="/account/profile"
                  className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Eye className="h-5 w-5 mr-3 text-blue-600" />
                  View Profile
                </Link>
                <Link
                  href="/account/settings"
                  className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Settings className="h-5 w-5 mr-3 text-green-600" />
                  Account Settings
                </Link>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/account/profile"
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Edit Profile →
                </Link>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-lg font-medium mb-4">Your Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm opacity-90">Lives Impacted</span>
                  <span className="font-semibold">25+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-90">Communities Helped</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm opacity-90">Causes Supported</span>
                  <span className="font-semibold">2</span>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/impact"
                  className="text-sm text-white opacity-90 hover:opacity-100 font-medium"
                >
                  View Full Impact →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Main page component that renders the client-only content
export default function DashboardPage() {
  return <DashboardContent />;
}
