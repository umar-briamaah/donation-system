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

import { Heart, ChevronDown, ChevronUp, Mail, Phone, MapPin } from 'lucide-react';

// Prevent prerendering
export const dynamic = 'force-dynamic';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "How do I know my donation is being used effectively?",
      answer: "We maintain complete transparency in all our operations. Every donation is tracked and reported with detailed impact metrics. You'll receive regular updates on how your contribution is making a difference, including photos, progress reports, and financial statements. We also conduct regular audits and publish annual reports to ensure accountability."
    },
    {
      question: "What percentage of my donation goes to the cause?",
      answer: "We're proud to say that 90% of every dollar donated goes directly to program activities. Only 10% is used for administrative costs, fundraising, and operational expenses. This ratio is well above industry standards and ensures maximum impact for your donation."
    },
    {
      question: "Can I make a recurring donation?",
      answer: "Yes! We offer several recurring donation options including monthly, quarterly, and yearly contributions. Recurring donations help us plan long-term projects and provide consistent support to communities in need. You can set up, modify, or cancel your recurring donation at any time through your account dashboard."
    },
    {
      question: "How do I get a tax receipt for my donation?",
      answer: "Tax receipts are automatically generated and sent to your email address immediately after each donation. You can also access all your donation history and download receipts from your account dashboard. For annual tax purposes, we provide a comprehensive year-end summary of all your contributions."
    },
    {
      question: "Can I donate anonymously?",
      answer: "Absolutely! We respect your privacy and offer the option to make anonymous donations. When you choose this option, your name will not appear in public donor lists, but you'll still receive all the benefits including tax receipts and impact updates."
    },
    {
      question: "What happens if a cause doesn't reach its funding goal?",
      answer: "If a cause doesn't reach its full funding goal, we work with our partners to implement the project with the available funds, adjusting the scope as necessary. In some cases, we may extend the fundraising period or combine resources from multiple sources to ensure the project moves forward."
    },
    {
      question: "How do you select the causes and projects you support?",
      answer: "We have a rigorous selection process that includes thorough research, community consultation, and impact assessment. We prioritize projects that address root causes, have strong local partnerships, and can demonstrate measurable outcomes. All causes are vetted by our program team and approved by our board of directors."
    },
    {
      question: "Can I volunteer or get involved beyond donating?",
      answer: "Yes! We welcome volunteers and offer various ways to get involved. You can volunteer your time, skills, or expertise in areas like fundraising, marketing, translation, or project management. We also offer opportunities to visit project sites and participate in community engagement programs."
    },
    {
      question: "How do you ensure the safety and security of my payment information?",
      answer: "We use industry-standard encryption and security measures to protect your payment information. All transactions are processed through secure payment gateways that comply with PCI DSS standards. We never store your credit card information on our servers."
    },
    {
      question: "What if I need to cancel or modify my donation?",
      answer: "You can modify or cancel your donation at any time through your account dashboard. For recurring donations, changes take effect immediately. If you need assistance, our support team is available to help you with any modifications or questions about your donations."
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "info@givehope.org",
      link: "mailto:info@givehope.org"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      link: "tel:+15551234567"
    },
    {
      icon: MapPin,
      label: "Address",
      value: "123 Hope Street, City, State 12345",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Find answers to common questions about donating, our programs, and how we make a difference.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-blue-500 rounded-lg">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
                  onClick={() => toggleItem(index)}
                >
                  <span className="text-lg font-medium text-blue-900">{faq.question}</span>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-blue-500" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-blue-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              Our team is here to help. Reach out to us and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {contactInfo.map((contact, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <contact.icon className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">{contact.label}</h3>
                <a
                  href={contact.link}
                  className="text-red-600 hover:text-red-700 transition-colors duration-200"
                >
                  {contact.value}
                </a>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">
              Send Us a Message
            </h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-blue-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-blue-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your last name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-blue-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="donation">Donation Question</option>
                  <option value="volunteer">Volunteer Opportunity</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-blue-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Additional Resources
            </h2>
            <p className="text-xl text-blue-600 max-w-2xl mx-auto">
              Learn more about our organization and how you can get involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-3">About Us</h3>
              <p className="text-blue-600 mb-4">
                Learn about our mission, values, and the team behind Give Hope.
              </p>
              <a
                href="/about"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Learn More →
              </a>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Our Impact</h3>
              <p className="text-blue-600 mb-4">
                See the real difference your donations make in communities worldwide.
              </p>
              <a
                href="/impact"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                View Impact →
              </a>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Get Involved</h3>
              <p className="text-blue-600 mb-4">
                Discover ways to volunteer, fund raise, or partner with us.
              </p>
              <a
                href="/get-involved"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Get Started →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
