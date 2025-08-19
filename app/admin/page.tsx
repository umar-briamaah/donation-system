'use client';

import { useState } from 'react';
import dynamicImport from 'next/dynamic'; // Renamed import to avoid conflicts

// Dynamically import components with no SSR to avoid useAuth errors
const Navigation = dynamicImport(() => import('../components/layout/Navigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-800" />
});

const Footer = dynamicImport(() => import('../components/layout/Footer'), {
  ssr: false
});

const AdminProtected = dynamicImport(() => import('../components/auth/AdminProtected'), {
  ssr: false
});

import { 
  Heart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Edit, 
  Plus, 
  Download,
  Star,
  Activity,
  Settings,
  BarChart3,
  UserCheck,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

// Prevent prerendering
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // System-wide statistics for admins to monitor
  const systemStats = [
    { label: "Total System Donations", value: "₵2.5M+", change: "+12%", icon: DollarSign, color: "text-green-600" },
    { label: "Active Donors", value: "15,234", change: "+8%", icon: Users, color: "text-blue-600" },
    { label: "Active Causes", value: "156", change: "+5%", icon: Heart, color: "text-red-600" },
    { label: "Success Rate", value: "94%", change: "+2%", icon: TrendingUp, color: "text-purple-600" }
  ];

  // Recent system activity for admins to monitor
  const recentSystemActivity = [
    {
      id: 1,
      type: "New Donor Registration",
      user: "John Smith",
      action: "Registered as donor",
      time: "2 minutes ago",
      status: "completed"
    },
    {
      id: 2,
      type: "Cause Status Update",
      cause: "Clean Water Project",
      action: "Status changed to ACTIVE",
      time: "15 minutes ago",
      status: "completed"
    },
    {
      id: 3,
      type: "Payment Processing",
      donor: "Sarah Johnson",
      amount: "₵500",
      action: "Payment completed",
      time: "1 hour ago",
      status: "completed"
    },
    {
      id: 4,
      type: "User Account Issue",
      user: "Mike Davis",
      action: "Account locked - requires review",
      time: "2 hours ago",
      status: "pending"
    }
  ];

  // Active causes that admins need to manage
  const activeCauses = [
    {
      id: 1,
      title: "Clean Water for Rural Communities",
      category: "Health & Sanitation",
      goal: 50000,
      raised: 35000,
      status: "active",
      featured: true,
      donors: 234,
      daysLeft: 45
    },
    {
      id: 2,
      title: "Education for Underprivileged Children",
      category: "Education",
      goal: 30000,
      raised: 22000,
      status: "active",
      featured: false,
      donors: 156,
      daysLeft: 30
    },
    {
      id: 3,
      title: "Emergency Relief for Natural Disasters",
      category: "Emergency Relief",
      goal: 75000,
      raised: 45000,
      status: "active",
      featured: true,
      donors: 89,
      daysLeft: 15
    }
  ];

  // User activity summary for admins
  const userActivitySummary = [
    { label: "New Users Today", value: "23", change: "+5", icon: UserCheck, color: "text-green-600" },
    { label: "Active Sessions", value: "1,247", change: "+12%", icon: Activity, color: "text-blue-600" },
    { label: "Pending Approvals", value: "8", change: "-2", icon: AlertTriangle, color: "text-yellow-600" },
    { label: "System Health", value: "98%", change: "0%", icon: CheckCircle, color: "text-green-600" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {/* Header Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-red-100 text-lg">System administration and platform management</p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Link 
                  href="/admin/causes/new" 
                  className="bg-white hover:bg-red-50 text-red-600 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  <span>New Cause</span>
                </Link>
                <button className="bg-red-500 hover:bg-red-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105">
                  <Download className="h-5 w-5" />
                  <span>Export Data</span>
                </button>
                <button 
                  onClick={() => {
                    localStorage.removeItem('auth_user');
                    window.location.href = '/account/login';
                  }}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'System Overview' },
                { id: 'causes', label: 'Cause Management' },
                { id: 'donations', label: 'Donation Tracking' },
                { id: 'users', label: 'User Management' },
                { id: 'reports', label: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* System Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {systemStats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                        <stat.icon className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
                      <span className="text-sm text-gray-500 ml-2">from last month</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* User Activity Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userActivitySummary.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                        <stat.icon className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">from yesterday</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent System Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* System Activity Log */}
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <h3 className="text-xl font-semibold text-gray-900">Recent System Activity</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {recentSystemActivity.map((activity) => (
                      <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-1">{activity.type}</p>
                            <p className="text-sm text-gray-600 mb-1">{activity.action}</p>
                            <p className="text-xs text-gray-400">{activity.time}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <Link href="/admin/activity" className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                      View all activity →
                    </Link>
                  </div>
                </div>

                {/* Active Causes Management */}
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <h3 className="text-xl font-semibold text-gray-900">Active Causes to Manage</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {activeCauses.map((cause) => (
                      <div key={cause.id} className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-900">{cause.title}</h4>
                          {cause.featured && <Star className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{cause.category}</p>
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{Math.round((cause.raised / cause.goal) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((cause.raised / cause.goal) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mb-3">
                          <span>₵{cause.raised.toLocaleString()} raised</span>
                          <span>₵{cause.goal.toLocaleString()} goal</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mb-4">
                          <span>{cause.donors} donors</span>
                          <span>{cause.daysLeft} days left</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1 px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-150">
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </button>
                          <button className="text-xs text-green-600 hover:text-green-700 flex items-center space-x-1 px-2 py-1 rounded hover:bg-green-50 transition-colors duration-150">
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button className="text-xs text-purple-600 hover:text-purple-700 flex items-center space-x-1 px-2 py-1 rounded hover:bg-purple-50 transition-colors duration-150">
                            <Settings className="h-3 w-3" />
                            <span>Manage</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <Link href="/admin/causes" className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                      Manage all causes →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                  <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link href="/admin/causes/new" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 group">
                      <Plus className="h-8 w-8 text-red-500 mr-3 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Create Cause</h4>
                        <p className="text-sm text-gray-500">Add new campaign</p>
                      </div>
                    </Link>
                    <Link href="/admin/donations" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 group">
                      <DollarSign className="h-8 w-8 text-red-500 mr-3 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Track Donations</h4>
                        <p className="text-sm text-gray-500">Monitor all payments</p>
                      </div>
                    </Link>
                    <Link href="/admin/users" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 group">
                      <Users className="h-8 w-8 text-red-500 mr-3 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Manage Users</h4>
                        <p className="text-sm text-gray-500">User accounts</p>
                      </div>
                    </Link>
                    <Link href="/admin/reports" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all duration-200 group">
                      <BarChart3 className="h-8 w-8 text-red-500 mr-3 group-hover:scale-110 transition-transform duration-200" />
                      <div>
                        <h4 className="font-semibold text-gray-900">Analytics</h4>
                        <p className="text-sm text-gray-500">System reports</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'causes' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Cause Management</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Cause management interface will be implemented here.</p>
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Donation Tracking</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Donation tracking interface will be implemented here.</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">User Management</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">User management interface will be implemented here.</p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Analytics & Reports</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-500">Analytics and reporting interface will be implemented here.</p>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </AdminProtected>
  );
}
