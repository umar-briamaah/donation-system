'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Heart, Star, ArrowRight, Clock, AlertTriangle } from 'lucide-react';

interface Cause {
  id: number;
  title: string;
  description: string;
  image: string;
  goal: number;
  raised: number;
  category: string;
  featured: boolean;
  urgency: string;
}

interface FeaturedCausesSectionProps {
  causes: Cause[];
}

const FeaturedCausesSection = memo(({ causes }: FeaturedCausesSectionProps) => {
  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'HIGH':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'HIGH':
        return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      default:
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Causes
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Support these urgent causes and make an immediate impact in communities that need it most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause) => (
            <div key={cause.id} className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center overflow-hidden">
                <Heart className="h-16 w-16 text-white group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                
                {/* Urgency Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white border ${getUrgencyColor(cause.urgency)}`}>
                  <div className="flex items-center space-x-1">
                    {getUrgencyIcon(cause.urgency)}
                    <span className="capitalize">{cause.urgency}</span>
                  </div>
                </div>
                
                {/* Featured Badge */}
                {cause.featured && (
                  <div className="absolute top-3 right-3">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-red-600 dark:text-red-400 font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
                    {cause.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                  {cause.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {cause.description}
                </p>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Raised</span>
                    <span>${cause.raised.toLocaleString()} / ${cause.goal.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round((cause.raised / cause.goal) * 100)}% Complete
                  </div>
                </div>

                {/* Donate Button */}
                <Link
                  href={`/donate/${cause.id}`}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 text-center block transform hover:scale-105 hover:shadow-lg group-hover:shadow-xl"
                >
                  Donate Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/causes"
            className="inline-flex items-center space-x-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold text-lg group transition-colors duration-300"
          >
            <span>View All Causes</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
});

FeaturedCausesSection.displayName = 'FeaturedCausesSection';

export default FeaturedCausesSection;
