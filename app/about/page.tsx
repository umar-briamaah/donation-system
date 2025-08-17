import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { Heart, Users, Globe, Award, Target, Shield } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: "Years of Service", value: "15+", icon: Award },
    { label: "Countries Reached", value: "25+", icon: Globe },
    { label: "Lives Impacted", value: "50K+", icon: Users },
    { label: "Success Rate", value: "94%", icon: Target }
  ];

  const values = [
    {
      title: "Transparency",
      description: "We believe in complete transparency in all our operations. Every dollar donated is tracked and reported with detailed impact metrics.",
      icon: Shield
    },
    {
      title: "Accountability",
      description: "We hold ourselves accountable to our donors, beneficiaries, and the communities we serve. Regular audits and reports ensure we maintain the highest standards.",
      icon: Target
    },
    {
      title: "Innovation",
      description: "We continuously innovate our approach to maximize impact and efficiency in delivering aid to those who need it most.",
      icon: Award
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Executive Director",
      bio: "Sarah has over 15 years of experience in nonprofit management and international development.",
      image: "/images/team/sarah.jpg"
    },
    {
      name: "Michael Chen",
      role: "Program Director",
      bio: "Michael specializes in program development and has worked in over 20 countries across Africa and Asia.",
      image: "/images/team/michael.jpg"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Medical Director",
      bio: "Dr. Rodriguez brings 12 years of medical experience in under served communities worldwide.",
      image: "/images/team/emily.jpg"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Give Hope
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            We are a nonprofit organization dedicated to creating positive change in communities around the world through strategic giving and sustainable development.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Our Mission
            </h2>
            <p className="text-xl text-blue-600 max-w-3xl mx-auto">
              To empower communities and individuals by providing access to essential resources, education, and opportunities that create lasting positive change.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Making a Difference Since 2009
              </h3>
              <p className="text-blue-600 mb-6">
                Give Hope was founded with a simple yet powerful vision: to create a world where every individual has the opportunity to thrive, regardless of their circumstances. What started as a small local initiative has grown into a global movement that has touched the lives of thousands.
              </p>
              <p className="text-blue-600 mb-6">
                Our approach focuses on sustainable solutions that address root causes rather than just symptoms. We work closely with local communities to understand their unique challenges and develop tailored programs that create lasting impact.
              </p>
              <p className="text-blue-600">
                Through strategic partnerships, innovative technology, and the generous support of donors worldwide, we&apos;ve been able to expand our reach and deepen our impact across multiple continents.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-lg p-8 text-white text-center">
              <Heart className="h-24 w-24 mx-auto mb-4" />
              <h4 className="text-xl font-semibold mb-2">Our Vision</h4>
              <p className="text-red-100">
                A world where hope is not just a feeling, but a reality for every person, regardless of where they were born or what challenges they face.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-12 w-12 text-red-500" />
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-2">{stat.value}</div>
                <div className="text-blue-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we approach our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <value.icon className="h-16 w-16 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-3">{value.title}</h3>
                <p className="text-blue-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              Our experienced team brings together diverse expertise in international development, nonprofit management, and community engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                  <Users className="h-16 w-16 text-white" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">{member.name}</h3>
                  <p className="text-red-600 font-medium mb-3">{member.role}</p>
                  <p className="text-blue-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              See how your support has made a real difference in communities around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Education Programs</h3>
              <p className="text-blue-600 mb-4">
                We&apos;ve helped over 15,000 children access quality education through school construction, teacher training, and scholarship programs.
              </p>
              <div className="text-2xl font-bold text-red-600">15,000+</div>
              <div className="text-sm text-blue-500">Children educated</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Healthcare Access</h3>
              <p className="text-blue-600 mb-4">
                Our medical programs have provided healthcare access to over 20,000 people in rural and under served communities.
              </p>
              <div className="text-2xl font-bold text-red-600">20,000+</div>
              <div className="text-sm text-blue-500">People served</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Clean Water</h3>
              <p className="text-blue-600 mb-4">
                We&apos;ve built over 200 water wells and purification systems, providing clean water to more than 50,000 people.
              </p>
              <div className="text-2xl font-bold text-red-600">50,000+</div>
              <div className="text-sm text-blue-500">People with clean water</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Your support helps us continue our mission of creating hope and opportunity for communities around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/causes"
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-100 transition-colors duration-200"
            >
              Browse Causes
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-600 transition-colors duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
