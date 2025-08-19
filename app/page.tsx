'use client';

import dynamicImport from 'next/dynamic';

// Dynamically import components with no SSR to avoid useAuth errors
const SimpleNavigation = dynamicImport(() => import('./components/layout/SimpleNavigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-800" />
});

const Footer = dynamicImport(() => import('./components/layout/Footer'), {
  ssr: false
});

// Prevent prerendering
export const dynamic = 'force-dynamic';

export default function HomePage() {
  // Mock data for dashboard
  const stats = [
    { label: "Total Donations", value: "$2.5M+", icon: "TrendingUp", color: "text-green-600" },
    { label: "Active Donors", value: "15,234", icon: "Users", color: "text-blue-600" },
    { label: "Active Causes", value: "156", icon: "Heart", color: "text-red-600" },
    { label: "Success Rate", value: "94%", icon: "Award", color: "text-purple-600" }
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
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Make a Difference Today
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join thousands of donors helping communities around the world. Every donation counts towards creating positive change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/causes"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Causes
            </a>
            <a
              href="/account/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors duration-200"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how your generous donations are making a real difference in communities worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Donations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recent Donations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the latest contributions from our generous donors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{donation.donor}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                    {donation.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{donation.cause}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">₵{donation.amount}</span>
                  <span className="text-sm text-gray-500">{donation.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Causes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Active Causes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Support these urgent causes and make an immediate impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCauses.map((cause) => (
              <div key={cause.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{cause.title}</h3>
                    {cause.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{cause.category}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Raised: ₵{cause.raised.toLocaleString()}</span>
                      <span>Goal: ₵{cause.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <a
                    href={`/donate/${cause.id}`}
                    className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    Donate Now
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a
              href="/causes"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
            >
              View All Causes
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
