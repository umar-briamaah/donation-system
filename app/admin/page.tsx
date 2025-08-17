'use client';

import { useState } from 'react';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import AdminProtected from '../components/auth/AdminProtected';
import { 
  Heart, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Edit, 
  Plus, 
  Download,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for dashboard
  const stats = [
    { label: "Total Donations", value: "$2.5M+", change: "+12%", icon: DollarSign, color: "text-green-600" },
    { label: "Active Donors", value: "15,234", change: "+8%", icon: Users, color: "text-blue-600" },
    { label: "Active Causes", value: "156", change: "+5%", icon: Heart, color: "text-red-600" },
    { label: "Success Rate", value: "94%", change: "+2%", icon: TrendingUp, color: "text-purple-600" }
  ];

  const recentDonations = [
    {
      id: 1,
      donor: "John Smith",
      amount: 250,
      cause: "Clean Water for Rural Communities",
      date: "2024-08-15",
      status: "completed"
    },
    {
      id: 2,
      donor: "Sarah Johnson",
      amount: 100,
      cause: "Education for Underprivileged Children",
      date: "2024-08-15",
      status: "completed"
    },
    {
      id: 3,
      donor: "Mike Davis",
      amount: 500,
      cause: "Emergency Relief for Natural Disasters",
      date: "2024-08-14",
      status: "completed"
    },
    {
      id: 4,
      donor: "Lisa Wilson",
      amount: 75,
      cause: "Medical Supplies for Rural Clinics",
      date: "2024-08-14",
      status: "pending"
    }
  ];

  const activeCauses = [
    {
      id: 1,
      title: "Clean Water for Rural Communities",
      category: "Health & Sanitation",
      goal: 50000,
      raised: 35000,
      status: "active",
      featured: true
    },
    {
      id: 2,
      title: "Education for Underprivileged Children",
      category: "Education",
      goal: 30000,
      raised: 22000,
      status: "active",
      featured: false
    },
    {
      id: 3,
      title: "Emergency Relief for Natural Disasters",
      category: "Emergency Relief",
      goal: 75000,
      raised: 45000,
      status: "active",
      featured: true
    }
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
        <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your donation system and monitor performance</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Cause</span>
              </button>
              <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'causes', label: 'Causes' },
              { id: 'donations', label: 'Donations' },
              { id: 'users', label: 'Users' },
              { id: 'reports', label: 'Reports' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Donations */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Donations</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentDonations.map((donation) => (
                    <div key={donation.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{donation.donor}</p>
                          <p className="text-sm text-gray-500">{donation.cause}</p>
                          <p className="text-xs text-gray-400">{new Date(donation.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-gray-900">${donation.amount}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(donation.status)}`}>
                            {donation.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <Link href="/admin/donations" className="text-red-600 hover:text-red-700 text-sm font-medium">
                    View all donations →
                  </Link>
                </div>
              </div>

              {/* Active Causes */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Active Causes</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {activeCauses.map((cause) => (
                    <div key={cause.id} className="px-6 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">{cause.title}</h4>
                        {cause.featured && <Star className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{cause.category}</p>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round((cause.raised / cause.goal) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${Math.min((cause.raised / cause.goal) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>${cause.raised.toLocaleString()} raised</span>
                        <span>${cause.goal.toLocaleString()} goal</span>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        <button className="text-xs text-green-600 hover:text-green-700 flex items-center space-x-1">
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <Link href="/admin/causes" className="text-red-600 hover:text-red-700 text-sm font-medium">
                    View all causes →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/causes/new" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors duration-200">
                  <Plus className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Create New Cause</h4>
                    <p className="text-sm text-gray-500">Add a new donation campaign</p>
                  </div>
                </Link>
                <Link href="/admin/donations" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors duration-200">
                  <DollarSign className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">View Donations</h4>
                    <p className="text-sm text-gray-500">Monitor all donations</p>
                  </div>
                </Link>
                <Link href="/admin/reports" className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors duration-200">
                  <TrendingUp className="h-8 w-8 text-red-500 mr-3" />
                  <div>
                    <h4 className="font-medium text-gray-900">Generate Reports</h4>
                    <p className="text-sm text-gray-500">Create performance reports</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'causes' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Manage Causes</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500">Causes management interface will be implemented here.</p>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Donation Management</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500">Donation management interface will be implemented here.</p>
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
              <h3 className="text-lg font-medium text-gray-900">Reports & Analytics</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-500">Reports and analytics interface will be implemented here.</p>
            </div>
          </div>
        )}
      </div>

        <Footer />
      </div>
    </AdminProtected>
  );
}
