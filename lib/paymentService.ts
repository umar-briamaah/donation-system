import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: 'MOBILE_MONEY' | 'BANK_TRANSFER' | 'DEBIT_CARD' | 'CASH';
  provider: string;
  phone?: string; // For mobile money
  bankDetails?: {
    accountNumber: string;
    accountName: string;
    bankName: string;
  };
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
  };
  userId: string;
  causeId: string;
  message?: string;
  isAnonymous?: boolean;
}

export interface PaymentResponse {
  success: boolean;
  reference: string;
  message: string;
  transactionId?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
}

export interface PaymentStatusResponse {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  provider: string;
  reference: string;
  status: string;
  transactionId?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  donation: {
    id: string;
    amount: number;
    message?: string;
    isAnonymous: boolean;
    status: string;
    cause: {
      id: string;
      title: string;
    };
  };
  user: {
    name: string;
    email: string;
  };
}

export class GhanaPaymentService {
  private static generateReference(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `GH${timestamp}${random}`;
  }

  static async processMobileMoneyPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      const reference = this.generateReference();
      
      // Create donation record
      const donation = await prisma.donation.create({
        data: {
          amount: payment.amount,
          currency: payment.currency,
          message: payment.message,
          isAnonymous: payment.isAnonymous || false,
          status: 'PENDING',
          userId: payment.userId,
          causeId: payment.causeId,
        },
      });

      // Create payment record
      const paymentRecord = await prisma.payment.create({
        data: {
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          provider: payment.provider,
          reference,
          status: 'PENDING',
          metadata: {
            phone: payment.phone,
            provider: payment.provider,
          },
          donationId: donation.id,
          userId: payment.userId,
        },
      });

      // Simulate mobile money payment processing
      // In real implementation, integrate with actual mobile money APIs
      const isSuccess = Math.random() > 0.1; // 90% success rate for demo

      if (isSuccess) {
        // Update payment status
        await prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            status: 'COMPLETED',
            transactionId: `MM${Date.now()}`,
            metadata: {
              ...(paymentRecord.metadata as Record<string, unknown> || {}),
              processedAt: new Date().toISOString(),
              status: 'COMPLETED',
            },
          },
        });

        // Update donation status
        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'COMPLETED' },
        });

        // Update cause raised amount
        await prisma.cause.update({
          where: { id: payment.causeId },
          data: {
            raisedAmount: {
              increment: payment.amount,
            },
          },
        });

        return {
          success: true,
          reference,
          message: 'Payment processed successfully via mobile money',
          transactionId: `MM${Date.now()}`,
          status: 'COMPLETED',
        };
      } else {
        // Payment failed
        await prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            status: 'FAILED',
            metadata: {
              ...(paymentRecord.metadata as Record<string, unknown> || {}),
              failedAt: new Date().toISOString(),
              status: 'FAILED',
              reason: 'Mobile money payment failed',
            },
          },
        });

        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'FAILED' },
        });

        return {
          success: false,
          reference,
          message: 'Mobile money payment failed. Please try again.',
          status: 'FAILED',
        };
      }
    } catch (error) {
      console.error('Mobile money payment error:', error);
      throw new Error('Failed to process mobile money payment');
    }
  }

  static async processBankTransferPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      const reference = this.generateReference();
      
      // Create donation record
      const donation = await prisma.donation.create({
        data: {
          amount: payment.amount,
          currency: payment.currency,
          message: payment.message,
          isAnonymous: payment.isAnonymous || false,
          status: 'PENDING',
          userId: payment.userId,
          causeId: payment.causeId,
        },
      });

      // Create payment record
      await prisma.payment.create({
        data: {
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          provider: payment.provider,
          reference,
          status: 'PENDING',
          metadata: {
            bankDetails: payment.bankDetails,
            provider: payment.provider,
          },
          donationId: donation.id,
          userId: payment.userId,
        },
      });

      // For bank transfers, we set status as pending since it requires manual verification
      return {
        success: true,
        reference,
        message: 'Bank transfer initiated. Please complete the transfer and contact us for verification.',
        status: 'PENDING',
      };
    } catch (error) {
      console.error('Bank transfer payment error:', error);
      throw new Error('Failed to process bank transfer payment');
    }
  }

  static async processDebitCardPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      const reference = this.generateReference();
      
      // Create donation record
      const donation = await prisma.donation.create({
        data: {
          amount: payment.amount,
          currency: payment.currency,
          message: payment.message,
          isAnonymous: payment.isAnonymous || false,
          status: 'PENDING',
          userId: payment.userId,
          causeId: payment.causeId,
        },
      });

      // Create payment record
      const paymentRecord = await prisma.payment.create({
        data: {
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          provider: payment.provider,
          reference,
          status: 'PENDING',
          metadata: {
            cardLast4: payment.cardDetails?.cardNumber.slice(-4),
            cardType: this.detectCardType(payment.cardDetails?.cardNumber || ''),
            provider: payment.provider,
          },
          donationId: donation.id,
          userId: payment.userId,
        },
      });

      // Simulate local debit card processing
      // In real implementation, integrate with local payment gateways
      const isSuccess = Math.random() > 0.05; // 95% success rate for demo

      if (isSuccess) {
        // Update payment status
        await prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            status: 'COMPLETED',
            transactionId: `DC${Date.now()}`,
            metadata: {
              ...(paymentRecord.metadata as Record<string, unknown> || {}),
              processedAt: new Date().toISOString(),
              status: 'COMPLETED',
            },
          },
        });

        // Update donation status
        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'COMPLETED' },
        });

        // Update cause raised amount
        await prisma.cause.update({
          where: { id: payment.causeId },
          data: {
            raisedAmount: {
              increment: payment.amount,
            },
          },
        });

        return {
          success: true,
          reference,
          message: 'Payment processed successfully via debit card',
          transactionId: `DC${Date.now()}`,
          status: 'COMPLETED',
        };
      } else {
        // Payment failed
        await prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            status: 'FAILED',
            metadata: {
              ...(paymentRecord.metadata as Record<string, unknown> || {}),
              failedAt: new Date().toISOString(),
              status: 'FAILED',
              reason: 'Debit card payment failed',
            },
          },
        });

        await prisma.donation.update({
          where: { id: donation.id },
          data: { status: 'FAILED' },
        });

        return {
          success: false,
          reference,
          message: 'Debit card payment failed. Please check your card details and try again.',
          status: 'FAILED',
        };
      }
    } catch (error) {
      console.error('Debit card payment error:', error);
      throw new Error('Failed to process debit card payment');
    }
  }

  static async processCashPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      const reference = this.generateReference();
      
      // Create donation record
      const donation = await prisma.donation.create({
        data: {
          amount: payment.amount,
          currency: payment.currency,
          message: payment.message,
          isAnonymous: payment.isAnonymous || false,
          status: 'PENDING',
          userId: payment.userId,
          causeId: payment.causeId,
        },
      });

      // Create payment record
      await prisma.payment.create({
        data: {
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          provider: 'CASH',
          reference,
          status: 'PENDING',
                      metadata: {
              paymentType: 'CASH',
              instructions: 'Please visit our office or contact us to complete cash payment',
            },
          donationId: donation.id,
          userId: payment.userId,
        },
      });

      return {
        success: true,
        reference,
        message: 'Cash payment request created. Please contact us to complete the payment.',
        status: 'PENDING',
      };
    } catch (error) {
      console.error('Cash payment error:', error);
      throw new Error('Failed to process cash payment request');
    }
  }

  private static detectCardType(cardNumber: string): string {
    if (cardNumber.startsWith('4')) return 'VISA';
    if (cardNumber.startsWith('5')) return 'MASTERCARD';
    if (cardNumber.startsWith('6')) return 'DISCOVER';
    if (cardNumber.startsWith('34') || cardNumber.startsWith('37')) return 'AMEX';
    return 'UNKNOWN';
  }

  static async getPaymentStatus(reference: string): Promise<PaymentStatusResponse | null> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { reference },
        include: {
          donation: {
            include: {
              cause: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (!payment) {
        return null;
      }

      // Transform the Prisma result to match PaymentStatusResponse interface
      return {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        provider: payment.provider || '',
        reference: payment.reference,
        status: payment.status,
        transactionId: payment.transactionId || undefined,
        metadata: payment.metadata as Record<string, unknown> || {},
        createdAt: payment.createdAt.toISOString(),
        donation: {
          id: payment.donation.id,
          amount: payment.donation.amount,
          message: payment.donation.message || undefined,
          isAnonymous: payment.donation.isAnonymous,
          status: payment.donation.status,
          cause: {
            id: payment.donation.cause.id,
            title: payment.donation.cause.title,
          },
        },
        user: {
          name: payment.user.name,
          email: payment.user.email,
        },
      };
    } catch (error) {
      console.error('Get payment status error:', error);
      throw new Error('Failed to get payment status');
    }
  }

  static async verifyBankTransfer(reference: string, transactionId: string): Promise<PaymentResponse> {
    try {
      const payment = await prisma.payment.findUnique({
        where: { reference },
        include: { donation: true },
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          transactionId,
          metadata: {
            ...(payment.metadata as Record<string, unknown> || {}),
            verifiedAt: new Date().toISOString(),
            status: 'COMPLETED',
          },
        },
      });

      // Update donation status
      await prisma.donation.update({
        where: { id: payment.donation.id },
        data: { status: 'COMPLETED' },
      });

      // Update cause raised amount
      await prisma.cause.update({
        where: { id: payment.donation.causeId },
        data: {
          raisedAmount: {
            increment: payment.amount,
          },
        },
      });

      return {
        success: true,
        reference,
        message: 'Bank transfer verified successfully',
        transactionId,
        status: 'COMPLETED',
      };
    } catch (error) {
      console.error('Verify bank transfer error:', error);
      throw new Error('Failed to verify bank transfer');
    }
  }
}
