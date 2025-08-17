'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Loader2, Info } from 'lucide-react';

export default function TestEmailPage() {
  const [formData, setFormData] = useState({
    to: '',
    subject: 'Test Email from Give Hope Foundation',
    message: 'This is a test email to verify the email service configuration.',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    method?: string;
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testService = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/test-email');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to test email service',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <Mail className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Email Service Test</h1>
          <p className="text-gray-600 mt-2">
            Test and verify your SendGrid email service configuration
          </p>
        </div>

        {/* Service Test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Test Email Service Configuration</h2>
          <p className="text-gray-600 mb-4">
            Click the button below to test if your email service is properly configured.
          </p>
          <button
            onClick={testService}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Test Configuration
              </>
            )}
          </button>
        </div>

        {/* Send Test Email */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Send Test Email</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Email *
              </label>
              <input
                type="email"
                id="to"
                required
                value={formData.to}
                onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter recipient email address"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Email subject"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Email message content"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.to}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8">
            <div
              className={`rounded-lg p-4 ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.success ? 'Success!' : 'Error'}
                  </h3>
                  <div
                    className={`mt-2 text-sm ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    <p>{result.message}</p>
                    {result.method && (
                      <p className="mt-1">
                        <strong>Method:</strong> {result.method}
                      </p>
                    )}
                    {result.error && (
                      <p className="mt-1">
                        <strong>Error:</strong> {result.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Configuration Information</h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-blue-600" />
              <span>
                <strong>SendGrid API Key:</strong> Configured in environment variables
              </span>
            </div>
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-blue-600" />
              <span>
                <strong>From Email:</strong> noreply@givehopegh.org
              </span>
            </div>
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-blue-600" />
              <span>
                <strong>From Name:</strong> Give Hope Foundation
              </span>
            </div>
            <div className="flex items-center">
              <Info className="h-4 w-4 mr-2 text-blue-600" />
              <span>
                <strong>SMTP Fallback:</strong> Available if configured
              </span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Your SendGrid API key and configuration are stored securely in environment variables. 
              The email service will automatically try SendGrid first, then fall back to SMTP if configured.
            </p>
          </div>

          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
            <p className="text-xs text-yellow-700">
              <strong>Environment Variables Required:</strong> Make sure you have created a <code className="bg-yellow-200 px-1 rounded">.env.local</code> file 
              in your project root with the SendGrid API key and other configuration values.
            </p>
          </div>
        </div>

        {/* Quick Setup Guide */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-green-900 mb-4">Quick Setup Guide</h3>
          <div className="space-y-3 text-sm text-green-800">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-800 text-xs font-bold mr-3 mt-0.5">
                1
              </div>
              <p>Create a <code className="bg-green-200 px-1 rounded">.env.local</code> file in your project root</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-800 text-xs font-bold mr-3 mt-0.5">
                2
              </div>
              <p>Add your SendGrid API key: <code className="bg-green-200 px-1 rounded">SENDGRID_API_KEY=&quot;your-api-key&quot;</code></p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-800 text-xs font-bold mr-3 mt-0.5">
                3
              </div>
              <p>Restart your development server</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-800 text-xs font-bold mr-3 mt-0.5">
                4
              </div>
              <p>Test the configuration using the buttons above</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
