'use client';

import { useState } from 'react';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }, 3000);
  };

  const socialMediaLinks = [
    { name: 'Facebook', url: 'https://facebook.com/givehopegh', color: 'text-blue-600 hover:text-blue-700' },
    { name: 'Twitter', url: 'https://twitter.com/givehopegh', color: 'text-blue-400 hover:text-blue-500' },
    { name: 'Instagram', url: 'https://instagram.com/givehopegh', color: 'text-pink-600 hover:text-pink-700' },
    { name: 'YouTube', url: 'https://youtube.com/@givehopegh', color: 'text-red-600 hover:text-red-700' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/givehopegh', color: 'text-blue-700 hover:text-blue-800' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our causes or want to get involved? We&apos;d love to hear from you. 
            Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for contacting us. We&apos;ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      errors.subject ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    aria-invalid={!!errors.subject}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.subject}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${
                      errors.message ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
                  aria-describedby="submit-status"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" aria-hidden="true"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
                <div id="submit-status" className="sr-only">
                  {isSubmitting ? 'Form is being submitted' : 'Submit the contact form'}
                </div>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-red-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <a href="mailto:info@givehopegh.org" className="text-red-600 hover:text-red-700 transition-colors">
                      info@givehopegh.org
                    </a>
                    <br />
                    <a href="mailto:support@givehopegh.org" className="text-red-600 hover:text-red-700 transition-colors">
                      support@givehopegh.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-5 w-5 text-red-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <a href="tel:+233201234567" className="text-red-600 hover:text-red-700 transition-colors">
                      +233 20 123 4567
                    </a>
                    <br />
                    <a href="tel:+233249876543" className="text-red-600 hover:text-red-700 transition-colors">
                      +233 24 987 6543
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-red-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Office Address</h3>
                    <address className="text-gray-600 not-italic">
                      Give Hope Foundation<br />
                      123 Charity Street<br />
                      Accra, Ghana<br />
                      P.O. Box GP 12345
                    </address>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-red-600" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Office Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 2:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Emergency Contact</h3>
              <p className="text-red-700 mb-3">
                For urgent matters or emergency relief coordination, please call our 24/7 hotline:
              </p>
              <a href="tel:+233501234567" className="text-xl font-bold text-red-900 hover:text-red-800 transition-colors">
                +233 50 123 4567
              </a>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
              <p className="text-gray-600 mb-4">
                Stay updated with our latest causes and impact stories:
              </p>
              <div className="flex flex-wrap gap-3">
                {socialMediaLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} font-medium transition-colors duration-200 hover:underline`}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Find Us</h2>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-80 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-300 opacity-20"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Give Hope Foundation</h3>
                <p className="text-gray-600 mb-1">123 Charity Street, Accra, Ghana</p>
                <p className="text-sm text-gray-500">Coordinates: 5.5600° N, 0.2057° W</p>
                <div className="mt-4">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    Get Directions
                  </button>
                </div>
              </div>
              {/* Decorative map elements */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full opacity-60"></div>
              <div className="absolute top-8 right-8 w-2 h-2 bg-blue-500 rounded-full opacity-40"></div>
              <div className="absolute bottom-8 left-8 w-2 h-2 bg-green-500 rounded-full opacity-40"></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-500 rounded-full opacity-60"></div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Interactive map integration coming soon. For now, use the coordinates above or contact us for detailed directions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
