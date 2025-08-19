'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

function PaymentVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');
    
    if (reference || trxref) {
      verifyPayment(reference || trxref || '');
    } else {
      setError('No payment reference found');
      setVerificationStatus('failed');
    }
  }, [searchParams]);

  const verifyPayment = async (reference: string) => {
    try {
      // Call your Paystack verification API
      const response = await fetch(`/api/payments/paystack?donationId=${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentDetails(data.donation);
        
        // Determine status based on payment data
        if (data.donation.status === 'COMPLETED') {
          setVerificationStatus('success');
        } else if (data.donation.status === 'FAILED') {
          setVerificationStatus('failed');
        } else {
          setVerificationStatus('pending');
        }
      } else {
        setError('Failed to verify payment');
        setVerificationStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setError('Payment verification failed');
      setVerificationStatus('failed');
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-500" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-blue-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Payment Successful!';
      case 'failed':
        return 'Payment Failed';
      case 'pending':
        return 'Payment Pending';
      default:
        return 'Verifying Payment...';
    }
  };

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'success':
        return 'Thank you for your donation! Your payment has been processed successfully.';
      case 'failed':
        return 'We encountered an issue processing your payment. Please try again or contact support.';
      case 'pending':
        return 'Your payment is being processed. You will receive a confirmation email once completed.';
      default:
        return 'Please wait while we verify your payment...';
    }
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h1>
          <p className="text-gray-600">Please wait while we process your donation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {getStatusIcon()}
          </div>

          {/* Status Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {getStatusTitle()}
          </h1>

          {/* Status Message */}
          <p className="text-lg text-gray-600 mb-8">
            {getStatusMessage()}
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
              <div className="space-y-3">
                                 <div className="flex justify-between">
                   <span className="font-medium text-gray-700">Amount:</span>
                   <span className="text-gray-900">
                     {typeof paymentDetails.currency === 'string' ? paymentDetails.currency : 'N/A'} {typeof paymentDetails.amount === 'number' ? paymentDetails.amount : 'N/A'}
                   </span>
                 </div>
                 <div className="flex justify-between">
                   <span className="font-medium text-gray-700">Cause:</span>
                   <span className="text-gray-900">{typeof paymentDetails.cause === 'string' ? paymentDetails.cause : 'N/A'}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="font-medium text-gray-700">Reference:</span>
                   <span className="text-gray-900 font-mono text-sm">
                     {typeof paymentDetails.reference === 'string' ? paymentDetails.reference : 'N/A'}
                   </span>
                 </div>
                 <div className="flex justify-between">
                   <span className="font-medium text-gray-700">Status:</span>
                   <span className={`px-2 py-1 rounded text-sm font-medium ${
                     paymentDetails.status === 'COMPLETED' 
                       ? 'bg-green-100 text-green-800'
                       : paymentDetails.status === 'FAILED'
                       ? 'bg-red-100 text-red-800'
                       : 'bg-yellow-100 text-yellow-800'
                   }`}>
                     {typeof paymentDetails.status === 'string' ? paymentDetails.status : 'N/A'}
                   </span>
                 </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {verificationStatus === 'success' && (
              <>
                <button
                  onClick={() => router.push('/account/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push('/causes')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Donate Again
                </button>
              </>
            )}
            
            {verificationStatus === 'failed' && (
              <>
                <button
                  onClick={() => router.push('/causes')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/account/dashboard')}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Go to Dashboard
                </button>
              </>
            )}

            {verificationStatus === 'pending' && (
              <button
                onClick={() => router.push('/account/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Go to Dashboard
              </button>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500">
            <p>If you have any questions about your donation, please contact our support team.</p>
            <p className="mt-2">
              <a href="mailto:support@givehopegh.org" className="text-blue-600 hover:underline">
                support@givehopegh.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
          <p className="text-gray-600">Please wait while we load the payment verification page...</p>
        </div>
      </div>
    }>
      <PaymentVerificationContent />
    </Suspense>
  );
}
