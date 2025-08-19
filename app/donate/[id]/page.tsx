'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamicImport from 'next/dynamic'; // Renamed import to avoid conflicts

// Dynamically import components with no SSR to avoid useAuth errors
const Navigation = dynamicImport(() => import('../../components/layout/Navigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-800" />
});

const Footer = dynamicImport(() => import('../../components/layout/Footer'), {
  ssr: false
});

import { useAuth } from '../../contexts/AuthContext';
import { Heart, DollarSign, CreditCard, Smartphone, Building2, Banknote, CheckCircle, AlertCircle } from 'lucide-react';

// Prevent prerendering
export const dynamic = 'force-dynamic';

interface Cause {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  imageUrl?: string;
  category: string;
  location: string;
}

interface PaymentForm {
  amount: number;
  paymentMethod: 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'DEBIT_CARD' | 'CASH';
  provider: string;
  phone: string;
  message: string;
  isAnonymous: boolean;
  // Bank transfer fields
  accountNumber: string;
  accountName: string;
  bankName: string;
  // Card fields
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

const paymentProviders = {
  MOBILE_MONEY: [
    { id: 'MTN_MOMO', name: 'MTN Mobile Money', icon: Smartphone },
    { id: 'VODAFONE_CASH', name: 'Vodafone Cash', icon: Smartphone },
    { id: 'AIRTEL_MONEY', name: 'Airtel Money', icon: Smartphone },
  ],
  BANK_TRANSFER: [
    { id: 'ECOBANK', name: 'Ecobank Ghana', icon: Building2 },
    { id: 'GHL_BANK', name: 'Ghana Commercial Bank', icon: Building2 },
    { id: 'ZENITH_BANK', name: 'Zenith Bank Ghana', icon: Building2 },
    { id: 'ACCESS_BANK', name: 'Access Bank Ghana', icon: Building2 },
  ],
  DEBIT_CARD: [
    { id: 'GH_LINK', name: 'Ghana Link', icon: CreditCard },
    { id: 'EZWICH', name: 'E-Zwich', icon: CreditCard },
    { id: 'GHIPSS', name: 'GHIPSS', icon: CreditCard },
  ],
  CASH: [
    { id: 'CASH', name: 'Cash Payment', icon: Building2 },
  ],
};

export default function DonatePage() {
  const params = useParams();
  const causeId = params.id as string;
  
  const [cause, setCause] = useState<Cause | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    amount: 0,
    paymentMethod: 'MOBILE_MONEY',
    provider: 'MTN_MOMO',
    phone: '',
    message: '',
    isAnonymous: false,
    accountNumber: '',
    accountName: '',
    bankName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; message: string; reference?: string } | null>(null);

  useEffect(() => {
    // Mock cause data - in real app, fetch from API
    const mockCause: Cause = {
      id: causeId,
      title: 'Clean Water for Rural Communities in Northern Ghana',
      description: 'Help provide clean drinking water to rural communities in Northern Ghana through the construction of water wells and purification systems.',
      targetAmount: 50000,
      raisedAmount: 32000,
      category: 'Health & Sanitation',
      location: 'Northern Ghana',
    };
    
    setCause(mockCause);
    setLoading(false);
  }, [causeId]);

  const handleInputChange = (field: keyof PaymentForm, value: string | number | boolean) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentMethodChange = (method: PaymentForm['paymentMethod']) => {
    setPaymentForm(prev => ({
      ...prev,
      paymentMethod: method,
      provider: paymentProviders[method][0]?.id || '',
    }));
  };

  const validateForm = () => {
    if (paymentForm.amount <= 0) return 'Please enter a valid amount';
    
    switch (paymentForm.paymentMethod) {
      case 'MOBILE_MONEY':
        if (!paymentForm.phone) return 'Please enter your phone number';
        if (!paymentForm.provider) return 'Please select a mobile money provider';
        break;
      case 'BANK_TRANSFER':
        if (!paymentForm.accountNumber || !paymentForm.accountName || !paymentForm.bankName) {
          return 'Please fill in all bank details';
        }
        break;
      case 'DEBIT_CARD':
        if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.cardHolderName) {
          return 'Please fill in all card details';
        }
        break;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const paymentData = {
        amount: paymentForm.amount,
        currency: 'GHS',
        paymentMethod: paymentForm.paymentMethod,
        provider: paymentForm.provider,
        phone: paymentForm.phone,
        message: paymentForm.message,
        isAnonymous: paymentForm.isAnonymous,
        userId: 'demo-user-id', // In real app, get from auth context
        causeId: causeId,
        bankDetails: paymentForm.paymentMethod === 'BANK_TRANSFER' ? {
          accountNumber: paymentForm.accountNumber,
          accountName: paymentForm.accountName,
          bankName: paymentForm.bankName,
        } : undefined,
        cardDetails: paymentForm.paymentMethod === 'DEBIT_CARD' ? {
          cardNumber: paymentForm.cardNumber,
          expiryDate: paymentForm.expiryDate,
          cvv: paymentForm.cvv,
          cardHolderName: paymentForm.cardHolderName,
        } : undefined,
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      setPaymentResult(result);

      if (result.success) {
        // Reset form on success
        setPaymentForm({
          amount: 0,
          paymentMethod: 'MOBILE_MONEY',
          provider: 'MTN_MOMO',
          phone: '',
          message: '',
          isAnonymous: false,
          accountNumber: '',
          accountName: '',
          bankName: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardHolderName: '',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentResult({
        success: false,
        message: 'An error occurred while processing your payment. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!cause) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Cause not found</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (cause.raisedAmount / cause.targetAmount) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cause Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">{cause.title}</h1>
          </div>
          
          <p className="text-gray-600 mb-6">{cause.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">₵{cause.targetAmount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Target Amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₵{cause.raisedAmount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Raised So Far</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{cause.category}</div>
              <div className="text-sm text-gray-500">Category</div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Make Your Donation</h2>
          
          {paymentResult && (
            <div className={`mb-6 p-4 rounded-lg ${
              paymentResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center">
                {paymentResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <p className={`text-sm ${
                  paymentResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {paymentResult.message}
                </p>
              </div>
              {paymentResult.reference && (
                <p className="text-xs text-gray-600 mt-2">
                  Reference: {paymentResult.reference}
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (GHS)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₵</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={paymentForm.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter amount"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(paymentProviders).map(([method, providers]) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => handlePaymentMethodChange(method as PaymentForm['paymentMethod'])}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      paymentForm.paymentMethod === method
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      {(() => {
                        const IconComponent = providers[0]?.icon;
                        return IconComponent ? <IconComponent className="h-6 w-6 mb-2" /> : null;
                      })()}
                      <span className="text-xs font-medium">{method.replace('_', ' ')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Provider
              </label>
              <select
                value={paymentForm.provider}
                onChange={(e) => handleInputChange('provider', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                {paymentProviders[paymentForm.paymentMethod]?.map(provider => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Money Fields */}
            {paymentForm.paymentMethod === 'MOBILE_MONEY' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={paymentForm.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 0241234567"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the phone number registered with your mobile money account
                </p>
              </div>
            )}

            {/* Bank Transfer Fields */}
            {paymentForm.paymentMethod === 'BANK_TRANSFER' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={paymentForm.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={paymentForm.accountName}
                    onChange={(e) => handleInputChange('accountName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter account name"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={paymentForm.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter bank name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Debit Card Fields */}
            {paymentForm.paymentMethod === 'DEBIT_CARD' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={paymentForm.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={paymentForm.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentForm.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    value={paymentForm.cardHolderName}
                    onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter card holder name"
                    required
                  />
                </div>
              </div>
            )}

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={paymentForm.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Leave a message of hope..."
              ></textarea>
            </div>

            {/* Anonymous Donation */}
            <div className="flex items-center">
              <input
                id="anonymous"
                type="checkbox"
                checked={paymentForm.isAnonymous}
                onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
                Make this donation anonymous
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
            >
              {isProcessing ? 'Processing Payment...' : `Donate ₵${paymentForm.amount || 0}`}
            </button>
          </form>

          {/* Payment Instructions */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Instructions</h3>
            {paymentForm.paymentMethod === 'MOBILE_MONEY' && (
              <p className="text-sm text-gray-600">
                You will receive a mobile money prompt on your phone. Please enter your PIN to complete the payment.
              </p>
            )}
            {paymentForm.paymentMethod === 'BANK_TRANSFER' && (
              <p className="text-sm text-gray-600">
                Please transfer the amount to our account and contact us with the transaction reference for verification.
              </p>
            )}
            {paymentForm.paymentMethod === 'DEBIT_CARD' && (
              <p className="text-sm text-gray-600">
                Your card will be charged securely through our local payment gateway. You will receive a confirmation email.
              </p>
            )}
            {paymentForm.paymentMethod === 'CASH' && (
              <p className="text-sm text-gray-600">
                Please visit our office or contact us to arrange cash payment. We&apos;ll provide you with a receipt upon payment.
              </p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
