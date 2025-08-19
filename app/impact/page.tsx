'use client';

import dynamicImport from 'next/dynamic'; // Renamed import to avoid conflicts

// Dynamically import components with no SSR to avoid useAuth errors
const Navigation = dynamicImport(() => import('../components/layout/Navigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-800" />
});

const Footer = dynamicImport(() => import('../components/layout/Footer'), {
  ssr: false
});

import { Heart, Users, Globe, TrendingUp, Award, MapPin } from 'lucide-react';

// Prevent prerendering
export const dynamic = 'force-dynamic';

export default function ImpactPage() {
  const impactStats = [
    { label: "Total Donations", value: "$2.5M+", icon: TrendingUp, color: "text-green-800" },
    { label: "Lives Impacted", value: "50K+", icon: Users, color: "text-blue-800" },
    { label: "Countries Reached", value: "25+", icon: Globe, color: "text-purple-800" },
    { label: "Success Rate", value: "94%", icon: Award, color: "text-red-800" }
  ];

  const successStories = [
    {
      title: "Clean Water for Rural Communities",
      location: "Rural Africa",
      impact: "10,000+ people now have access to clean drinking water",
      description: "Through the generous support of our donors, we've been able to build 50 water wells and install 25 water purification systems in rural communities across Africa. This has dramatically improved health outcomes and reduced waterborne diseases.",
      image: "/images/impact/water-project.jpg",
      date: "2024",
      category: "Health & Sanitation"
    },
    {
      title: "Education for Underprivileged Children",
      location: "South Asia",
      impact: "15,000+ children now have access to quality education",
      description: "Our education initiative has helped build 30 schools, train 200+ teachers, and provide scholarships to thousands of children who otherwise wouldn't have been able to attend school. Many of these children are now the first in their families to receive an education.",
      image: "/images/impact/education-project.jpg",
      date: "2024",
      category: "Education"
    },
    {
      title: "Emergency Relief for Natural Disasters",
      location: "Global",
      impact: "20,000+ people received immediate assistance",
      description: "When natural disasters strike, our rapid response team provides immediate relief including food, shelter, medical care, and long-term recovery support. We've responded to earthquakes, floods, and hurricanes across multiple continents.",
      image: "/images/impact/relief-project.jpg",
      date: "2024",
      category: "Emergency Relief"
    }
  ];

  const impactAreas = [
    {
      category: "Health & Sanitation",
      projects: 45,
      peopleServed: 25000,
      description: "Improving access to clean water, healthcare, and sanitation facilities in under served communities."
    },
    {
      category: "Education",
      projects: 38,
      peopleServed: 15000,
      description: "Building schools, training teachers, and providing educational resources to children in need."
    },
    {
      category: "Emergency Relief",
      projects: 22,
      peopleServed: 20000,
      description: "Providing immediate assistance and long-term recovery support during crises and natural disasters."
    },
    {
      category: "Economic Development",
      projects: 28,
      peopleServed: 12000,
      description: "Supporting sustainable agriculture, small business development, and vocational training programs."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-800 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Our Impact
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            See how your generous donations are creating real change in communities around the world.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Numbers Tell Our Story
            </h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              Every statistic represents real people whose lives have been changed for the better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className={`h-12 w-12 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-800">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              Real projects, real people, real impact. These are just a few examples of how your support makes a difference.
            </p>
          </div>

          <div className="space-y-12">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-64 md:h-full bg-gradient-to-br from-red-400 to-red-800 flex items-center justify-center">
                      <Heart className="h-24 w-24 text-white" />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-sm text-red-800 font-semibold">{story.category}</span>
                      <span className="text-sm text-gray-500">{story.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{story.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {story.location}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-green-800 mb-4">{story.impact}</p>
                    <p className="text-gray-800 leading-relaxed">{story.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Areas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Areas of Impact
            </h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              We focus on key areas that create lasting positive change in communities worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {impactAreas.map((area, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{area.category}</h3>
                <p className="text-gray-800 mb-4">{area.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-800">{area.projects}</div>
                    <div className="text-sm text-gray-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-800">{area.peopleServed.toLocaleString()}+</div>
                    <div className="text-sm text-gray-500">People Served</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Your Donation Creates Impact
            </h2>
            <p className="text-xl text-gray-800 max-w-2xl mx-auto">
              From donation to delivery, here&apos;s how we ensure your contribution makes the maximum difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-800">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">You Donate</h3>
              <p className="text-gray-800">Choose a cause that matters to you and make your donation through our secure platform.</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-800">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We Plan</h3>
              <p className="text-gray-800">Our team works with local partners to develop and implement effective solutions.</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-800">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">We Execute</h3>
              <p className="text-gray-800">Projects are implemented with local communities, ensuring cultural sensitivity and sustainability.</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-red-800">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">You See Results</h3>
              <p className="text-gray-800">Receive regular updates, photos, and impact reports showing how your donation helped.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Be Part of the Change
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of donors who are already making a difference. Every donation, no matter the size, creates positive change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/causes"
              className="bg-white text-red-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Browse Causes
            </a>
            <a
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-800 transition-colors duration-200"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
