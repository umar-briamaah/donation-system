import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import { Heart, Users, DollarSign, Globe, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  // Mock data for featured causes
  const featuredCauses = [
    {
      id: 1,
      title: "Clean Water for Rural Communities",
      description: "Help provide clean drinking water to rural communities in developing countries.",
      image: "/images/water-cause.jpg",
      goal: 50000,
      raised: 35000,
      category: "Health & Sanitation",
      featured: true
    },
    {
      id: 2,
      title: "Education for Underprivileged Children",
      description: "Support education initiatives for children who cannot afford school supplies and tuition.",
      image: "/images/education-cause.jpg",
      goal: 30000,
      raised: 22000,
      category: "Education",
      featured: true
    },
    {
      id: 3,
      title: "Emergency Relief for Natural Disasters",
      description: "Provide immediate relief and support to communities affected by natural disasters.",
      image: "/images/relief-cause.jpg",
      goal: 75000,
      raised: 45000,
      category: "Emergency Relief",
      featured: true
    }
  ];

  const stats = [
    { label: "Total Donations", value: "$2.5M+", icon: DollarSign },
    { label: "Lives Impacted", value: "50K+", icon: Users },
    { label: "Active Causes", value: "150+", icon: Heart },
    { label: "Countries Reached", value: "25+", icon: Globe }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Give Hope, <span className="text-yellow-300">Change Lives</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join thousands of donors making a difference. Your contribution helps create positive change in communities around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/causes"
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>Browse Causes</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-red-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Causes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Causes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Support these urgent causes and make an immediate impact in communities that need it most.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCauses.map((cause) => (
              <div key={cause.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-red-600 font-semibold">{cause.category}</span>
                    {cause.featured && <Star className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{cause.title}</h3>
                  <p className="text-gray-600 mb-4">{cause.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Raised</span>
                      <span>${cause.raised.toLocaleString()} / ${cause.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Link
                    href={`/donate/${cause.id}`}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 text-center block"
                  >
                    Donate Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/causes"
              className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 font-semibold text-lg"
            >
              <span>View All Causes</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Making a difference is simple. Follow these three easy steps to start helping others.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose a Cause</h3>
              <p className="text-gray-600">Browse through our verified causes and select one that resonates with you.</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Make a Donation</h3>
              <p className="text-gray-600">Choose your amount and complete your secure donation through our platform.</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Your Impact</h3>
              <p className="text-gray-600">Receive updates on how your donation is making a difference in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of donors and start creating positive change today. Every donation counts.
          </p>
          <Link
            href="/causes"
            className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <span>Start Donating</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
