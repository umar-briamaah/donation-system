'use client';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { 
  Bell, 
  Shield, 
  Eye, 
  Palette, 
  Globe, 
  CheckCircle,
  Heart
} from 'lucide-react';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('preferences');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render content until mounted
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

  const handleSave = async (type: string) => {
    setMessage({
      type: 'success',
      text: `${type} saved successfully!`
    });

    setTimeout(() => setMessage(null), 3000);
  };

  const tabs = [
    { id: 'preferences', name: 'Preferences', icon: Heart },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'privacy', name: 'Privacy', icon: Eye },
    { id: 'regional', name: 'Regional', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your preferences, security, and account settings</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Eye className="h-5 w-5 text-red-500 mr-2" />
              )}
              <p className={`text-sm ${
                message.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {tabs.find(t => t.id === activeTab)?.name} Settings
            </h2>
            <p className="text-gray-600 mb-6">
              This section is under development. More settings will be available soon.
            </p>
            <button
              onClick={() => handleSave(activeTab)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium"
            >
              Save {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
