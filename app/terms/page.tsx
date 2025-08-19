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

import { Shield, FileText, CheckCircle } from 'lucide-react';

// Prevent prerendering
export const dynamic = 'force-dynamic';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last updated:</strong> August 15, 2024
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using the Give Hope Foundation donation platform (&quot;Platform&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Give Hope Foundation provides a platform for charitable donations to various causes in Ghana. The Platform allows users to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Browse and learn about charitable causes</li>
                <li>Make donations using various payment methods</li>
                <li>Track donation progress and impact</li>
                <li>Create and manage user accounts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To access certain features of the Platform, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Updating your information as necessary</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Donations and Payments</h2>
              <p className="text-gray-700 mb-4">
                By making a donation through our Platform, you acknowledge and agree to the following:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>All donations are final and non-refundable unless otherwise stated</li>
                <li>We accept various payment methods including mobile money, bank transfers, debit cards, and cash</li>
                <li>Payment processing fees may apply depending on the payment method</li>
                <li>Donations are processed in Ghanaian Cedi (GHS) by default</li>
                <li>You will receive a confirmation email for each donation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. We collect, use, and protect your personal information in accordance with our Privacy Policy. By using the Platform, you consent to our collection and use of information as outlined in our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the Platform to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Submit false or misleading information</li>
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Interfere with the proper functioning of the Platform</li>
                <li>Use the Platform for any commercial purposes without authorization</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Platform and its content, including but not limited to text, graphics, images, logos, and software, are the property of Give Hope Foundation and are protected by copyright and other intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Give Hope Foundation shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the Platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold harmless Give Hope Foundation from any claims, damages, or expenses arising from your use of the Platform or violation of these &quot;Terms of Service&quot;.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Modifications to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new terms on the Platform. Your continued use of the Platform after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to the Platform at any time, with or without cause, with or without notice. Upon termination, your right to use the Platform will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service shall be governed by and construed in accordance with the laws of Ghana. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Ghana.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Give Hope Foundation</strong><br />
                  Email: legal@givehopegh.org<br />
                  Phone: +233 20 123 4567<br />
                  Address: 123 Charity Street, Accra, Ghana
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Severability</h2>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms of Service is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms of Service will otherwise remain in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Entire Agreement</h2>
              <p className="text-gray-700 mb-4">
                These Terms of Service constitute the entire agreement between you and Give Hope Foundation regarding the use of the Platform and supersede all prior agreements and understandings.
              </p>
            </section>

            <div className="border-t pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                By using our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
