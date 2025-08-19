'use client';

import { useSimpleAuth } from '../../contexts/SimpleAuthContext';
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Settings, 
  Plus,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardContent() {
  const { user } = useSimpleAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name || 'User'}! 👋
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
              <p className="text-2xl font-bold text-gray-900">3</p>
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
              <p className="text-2xl font-bold text-gray-900">₵225</p>
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
              <p className="text-2xl font-bold text-gray-900">₵150</p>
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
              <p className="text-lg font-semibold text-gray-900">Clean Water</p>
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
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Clean Water for Rural Communities
                    </h3>
                    <p className="text-sm text-gray-500">Health & Sanitation</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">₵50</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      COMPLETED
                    </span>
                  </div>
                </div>
              </div>
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
                <p className="text-sm font-medium text-gray-900">{user?.name || 'John Doe'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900">{user?.email || 'john@example.com'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-sm font-medium text-gray-900">{user?.phone || '+233 20 123 4567'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-sm font-medium text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
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
  );
}
