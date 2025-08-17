import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { Heart, Search, Filter, Star, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function CausesPage() {
  // Mock data for causes
  const causes = [
    {
      id: 1,
      title: "Clean Water for Rural Communities",
      description: "Help provide clean drinking water to rural communities in developing countries. This initiative aims to build wells and water purification systems.",
      image: "/images/water-cause.jpg",
      goal: 50000,
      raised: 35000,
      category: "Health & Sanitation",
      featured: true,
      location: "Rural Africa",
      deadline: "2024-12-31"
    },
    {
      id: 2,
      title: "Education for Underprivileged Children",
      description: "Support education initiatives for children who cannot afford school supplies and tuition. Help break the cycle of poverty through education.",
      image: "/images/education-cause.jpg",
      goal: 30000,
      raised: 22000,
      category: "Education",
      featured: false,
      location: "South Asia",
      deadline: "2024-11-30"
    },
    {
      id: 3,
      title: "Emergency Relief for Natural Disasters",
      description: "Provide immediate relief and support to communities affected by natural disasters. Help rebuild lives and communities.",
      image: "/images/relief-cause.jpg",
      goal: 75000,
      raised: 45000,
      category: "Emergency Relief",
      featured: true,
      location: "Global",
      deadline: "2024-10-31"
    },
    {
      id: 4,
      title: "Medical Supplies for Rural Clinics",
      description: "Provide essential medical supplies and equipment to rural clinics serving underserved communities.",
      image: "/images/medical-cause.jpg",
      goal: 40000,
      raised: 28000,
      category: "Healthcare",
      featured: false,
      location: "Latin America",
      deadline: "2024-12-15"
    },
    {
      id: 5,
      title: "Sustainable Agriculture Training",
      description: "Train farmers in sustainable agricultural practices to improve food security and economic stability.",
      image: "/images/agriculture-cause.jpg",
      goal: 25000,
      raised: 15000,
      category: "Agriculture",
      featured: false,
      location: "East Africa",
      deadline: "2025-01-31"
    },
    {
      id: 6,
      title: "Women's Empowerment Programs",
      description: "Support programs that provide skills training, education, and resources to empower women in developing communities.",
      image: "/images/women-cause.jpg",
      goal: 35000,
      raised: 20000,
      category: "Women's Rights",
      featured: true,
      location: "South Asia",
      deadline: "2024-11-15"
    }
  ];

  const categories = ["All", "Health & Sanitation", "Education", "Emergency Relief", "Healthcare", "Agriculture", "Women's Rights"];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Browse Causes
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover meaningful causes and make a difference in communities around the world. Every donation counts.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search causes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Causes Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {causes.map((cause) => (
              <div key={cause.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center relative">
                  <Heart className="h-16 w-16 text-white" />
                  {cause.featured && (
                    <div className="absolute top-4 right-4">
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-red-600 font-semibold">{cause.category}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {Math.round((cause.raised / cause.goal) * 100)}% funded
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{cause.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{cause.description}</p>
                  
                  {/* Location and Deadline */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{cause.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(cause.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Raised</span>
                      <span>${cause.raised.toLocaleString()} / ${cause.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((cause.raised / cause.goal) * 100, 100)}%` }}
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

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Load More Causes
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Can&apos;t Find the Right Cause?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us to learn about creating a custom cause or supporting specific initiatives that matter to you.
          </p>
          <Link
            href="/contact"
            className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Contact Us
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
