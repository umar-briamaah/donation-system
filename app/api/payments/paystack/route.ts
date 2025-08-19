import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  initializePayment, 
  convertToKobo, 
  generateReference 
} from '../../../../lib/paystackService';
import { getAuthHeaders } from '../../../../lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeaders = getAuthHeaders(request);
    if (!authHeaders.Authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, currency, causeId, isAnonymous, message } = body;

    // Validate required fields
    if (!amount || !currency || !causeId) {
      return NextResponse.json({
        error: 'Missing required fields',
        required: ['amount', 'currency', 'causeId']
      }, { status: 400 });
    }

    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({
        error: 'Invalid amount. Must be a positive number.'
      }, { status: 400 });
    }

    // Get user from token
    const userResponse = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
      headers: authHeaders,
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = await userResponse.json();

    // Get cause details
    const cause = await prisma.cause.findUnique({
      where: { id: causeId },
      select: { id: true, title: true, description: true }
    });

    if (!cause) {
      return NextResponse.json({ error: 'Cause not found' }, { status: 404 });
    }

    // Create donation record
    const donation = await prisma.donation.create({
      data: {
        amount: numericAmount,
        currency: currency.toUpperCase(),
        causeId: causeId,
        userId: user.id,
        isAnonymous: isAnonymous || false,
        message: message || '',
        status: 'PENDING',
        donatedAt: new Date(),
      },
    });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: numericAmount,
        currency: currency.toUpperCase(),
        paymentMethod: 'DEBIT_CARD', // Paystack typically processes card payments
        provider: 'PAYSTACK',
        reference: generateReference(),
        status: 'PENDING',
        donationId: donation.id,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Convert amount to kobo (Paystack's smallest unit)
    const amountInKobo = convertToKobo(numericAmount, currency);

    // Prepare payment request
    const paymentRequest = {
      amount: amountInKobo,
      email: user.email,
      reference: payment.reference,
      callbackUrl: `${request.nextUrl.origin}/payment/verify`,
      metadata: {
        custom_fields: [
          {
            display_name: 'Cause ID',
            variable_name: 'cause_id',
            value: causeId,
          },
          {
            display_name: 'Cause Title',
            variable_name: 'cause_title',
            value: cause.title,
          },
          {
            display_name: 'Donor Name',
            variable_name: 'donor_name',
            value: isAnonymous ? 'Anonymous' : user.name,
          },
          {
            display_name: 'Anonymous',
            variable_name: 'is_anonymous',
            value: isAnonymous ? 'true' : 'false',
          },
          {
            display_name: 'Message',
            variable_name: 'message',
            value: message || '',
          },
        ],
        cause_id: causeId,
        cause_title: cause.title,
        donor_name: isAnonymous ? 'Anonymous' : user.name,
        is_anonymous: isAnonymous,
        message: message || '',
      },
    };

    // Initialize payment via Paystack
    const paymentResponse = await initializePayment(paymentRequest);

    if (!paymentResponse.status) {
      // Update donation status to failed
      await prisma.donation.update({
        where: { id: donation.id },
        data: { 
          status: 'FAILED',
        }
      });

      return NextResponse.json({
        error: 'Payment initialization failed',
        message: paymentResponse.message,
        details: paymentResponse
      }, { status: 400 });
    }

    // Update payment with transaction details
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        transactionId: paymentResponse.data.reference,
        status: 'PENDING',
        updatedAt: new Date(),
      },
    });

    // Get updated donation with relations
    const updatedDonation = await prisma.donation.findUnique({
      where: { id: donation.id },
      include: {
        cause: true,
        user: true,
      }
    });

    if (!updatedDonation) {
      return NextResponse.json({
        error: 'Failed to retrieve donation details',
        message: 'Donation created but could not be retrieved'
      }, { status: 500 });
    }

    // Return success response with payment URL
    return NextResponse.json({
      success: true,
      message: 'Payment initialized successfully',
      donation: {
        id: updatedDonation.id,
        amount: updatedDonation.amount,
        currency: updatedDonation.currency,
        status: updatedDonation.status,
        reference: payment.reference,
        transactionId: payment.transactionId,
        cause: updatedDonation.cause.title,
        donatedAt: updatedDonation.donatedAt,
      },
      payment: {
        authorizationUrl: paymentResponse.data.authorization_url,
        reference: paymentResponse.data.reference,
        message: paymentResponse.message,
      },
      instructions: [
        'Click the payment link to complete your donation',
        'Choose your preferred payment method (card, bank transfer, mobile money)',
        'Complete the payment on Paystack\'s secure platform',
        'You will be redirected back after payment completion'
      ]
    });

  } catch (error) {
    console.error('Error processing Paystack payment:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to process payment request'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeaders = getAuthHeaders(request);
    if (!authHeaders.Authorization) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const donationId = searchParams.get('donationId');

    if (!donationId) {
      return NextResponse.json({
        error: 'Missing donation ID'
      }, { status: 400 });
    }

    // Get donation details
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        cause: true,
        user: true,
      }
    });

    if (!donation) {
      return NextResponse.json({
        error: 'Donation not found'
      }, { status: 404 });
    }

    // Get payment record for this donation
    const payment = await prisma.payment.findFirst({
      where: { donationId: donation.id }
    });

    // Return donation status
    return NextResponse.json({
      success: true,
      donation: {
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        status: donation.status,
        reference: payment?.reference || 'N/A',
        transactionId: payment?.transactionId || 'N/A',
        cause: donation.cause.title,
        donatedAt: donation.donatedAt,
      }
    });

  } catch (error) {
    console.error('Error getting donation status:', error);
    
    return NextResponse.json({
      error: 'Internal server error',
      message: 'Failed to get donation status'
    }, { status: 500 });
  }
}
