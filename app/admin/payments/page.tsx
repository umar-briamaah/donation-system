'use client';

import { useState, useEffect } from 'react';
import dynamicImport from 'next/dynamic'; // Renamed import to avoid conflicts

// Dynamically import components with no SSR to avoid useAuth errors
const Navigation = dynamicImport(() => import('../../components/layout/Navigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-800" />
});

const Footer = dynamicImport(() => import('../../components/layout/Footer'), {
  ssr: false
});

const AdminProtected = dynamicImport(() => import('../../components/auth/AdminProtected'), {
  ssr: false
});

import { Eye, CheckCircle, XCircle, Clock, DollarSign, Smartphone, Building2, CreditCard, Banknote } from 'lucide-react';

// Prevent prerendering
export const dynamic = 'force-dynamic';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  provider: string;
  reference: string;
  status: string;
  transactionId?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  donation: {
    cause: {
      title: string;
    };
  };
  metadata: Record<string, unknown>;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [verificationData, setVerificationData] = useState({
    reference: '',
    transactionId: '',
  });

  useEffect(() => {
    // Mock payments data - in real app, fetch from API
    const mockPayments: Payment[] = [
      {
        id: '1',
        amount: 250,
        currency: 'GHS',
        paymentMethod: 'MOBILE_MONEY',
        provider: 'MTN_MOMO',
        reference: 'GH1234567890ABC',
        status: 'COMPLETED',
        transactionId: 'MM123456789',
        createdAt: '2024-08-15T10:30:00Z',
        user: { name: 'John Doe', email: 'john@example.com' },
        donation: { cause: { title: 'Clean Water Project' } },
        metadata: { phone: '0241234567' },
      },
      {
        id: '2',
        amount: 500,
        currency: 'GHS',
        paymentMethod: 'BANK_TRANSFER',
        provider: 'ECOBANK',
        reference: 'GH1234567890DEF',
        status: 'PENDING',
        createdAt: '2024-08-15T09:15:00Z',
        user: { name: 'Jane Smith', email: 'jane@example.com' },
        donation: { cause: { title: 'Education Fund' } },
        metadata: { bankDetails: { accountNumber: '1234567890', accountName: 'Jane Smith', bankName: 'Ecobank' } },
      },
      {
        id: '3',
        amount: 100,
        currency: 'GHS',
        paymentMethod: 'DEBIT_CARD',
        provider: 'GH_LINK',
        reference: 'GH1234567890GHI',
        status: 'COMPLETED',
        transactionId: 'DC123456789',
        createdAt: '2024-08-15T08:45:00Z',
        user: { name: 'Mike Johnson', email: 'mike@example.com' },
        donation: { cause: { title: 'Healthcare Initiative' } },
        metadata: { cardLast4: '3456', cardType: 'VISA' },
      },
    ];

    setPayments(mockPayments);
    setLoading(false);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'MOBILE_MONEY':
        return <Smartphone className="h-5 w-5 text-blue-500" />;
      case 'BANK_TRANSFER':
        return <Building2 className="h-5 w-5 text-purple-500" />;
      case 'DEBIT_CARD':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'CASH':
        return <Banknote className="h-5 w-5 text-orange-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleVerifyBankTransfer = async () => {
    if (!verificationData.reference || !verificationData.transactionId) {
      alert('Please fill in both reference and transaction ID');
      return;
    }

    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Bank transfer verified successfully!');
        // Refresh payments list
        window.location.reload();
      } else {
        alert('Failed to verify bank transfer: ' + result.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('An error occurred during verification');
    }
  };

  const filteredPayments = payments.filter(payment => 
    payment.status === 'PENDING' || payment.status === 'COMPLETED'
  );

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

  return (
    <AdminProtected>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600">Monitor and manage all payment transactions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <XCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.status === 'FAILED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₵{payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Transfer Verification */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Verify Bank Transfer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Reference
              </label>
              <input
                type="text"
                value={verificationData.reference}
                onChange={(e) => setVerificationData(prev => ({ ...prev, reference: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter payment reference"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID
              </label>
              <input
                type="text"
                value={verificationData.transactionId}
                onChange={(e) => setVerificationData(prev => ({ ...prev, transactionId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter transaction ID"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleVerifyBankTransfer}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
              >
                Verify Transfer
              </button>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cause
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            ₵{payment.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.reference}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.user.name}</div>
                      <div className="text-sm text-gray-500">{payment.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.donation.cause.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                        <span className="ml-2 text-sm text-gray-900">
                          {payment.paymentMethod.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{payment.provider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Reference:</span>
                  <span className="ml-2 text-gray-600">{selectedPayment.reference}</span>
                </div>
                <div>
                  <span className="font-medium">Amount:</span>
                  <span className="ml-2 text-gray-600">₵{selectedPayment.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium">Method:</span>
                  <span className="ml-2 text-gray-600">{selectedPayment.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="font-medium">Provider:</span>
                  <span className="ml-2 text-gray-600">{selectedPayment.provider}</span>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <span className="ml-2 text-gray-600">{selectedPayment.status}</span>
                </div>
                {selectedPayment.transactionId && (
                  <div>
                    <span className="font-medium">Transaction ID:</span>
                    <span className="ml-2 text-gray-600">{selectedPayment.transactionId}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium">User:</span>
                  <span className="ml-2 text-gray-600">{selectedPayment.user.name}</span>
                </div>
                <div>
                  <span className="font-medium">Cause:</span>
                  <span className="ml-2 text-gray-600">{selectedPayment.donation.cause.title}</span>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(selectedPayment.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        <Footer />
      </div>
    </AdminProtected>
  );
}
