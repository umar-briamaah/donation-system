import { NextRequest, NextResponse } from 'next/server';
import { GhanaPaymentService, PaymentRequest } from '@/lib/paymentService';

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();
    
    // Validate required fields
    if (!body.amount || !body.paymentMethod || !body.provider || !body.userId || !body.causeId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    let response;

    switch (body.paymentMethod) {
      case 'MOBILE_MONEY':
        if (!body.phone) {
          return NextResponse.json(
            { message: 'Phone number is required for mobile money payments' },
            { status: 400 }
          );
        }
        response = await GhanaPaymentService.processMobileMoneyPayment(body);
        break;

      case 'BANK_TRANSFER':
        if (!body.bankDetails) {
          return NextResponse.json(
            { message: 'Bank details are required for bank transfer payments' },
            { status: 400 }
          );
        }
        response = await GhanaPaymentService.processBankTransferPayment(body);
        break;

      case 'DEBIT_CARD':
        if (!body.cardDetails) {
          return NextResponse.json(
            { message: 'Card details are required for debit card payments' },
            { status: 400 }
          );
        }
        response = await GhanaPaymentService.processDebitCardPayment(body);
        break;

      case 'CASH':
        response = await GhanaPaymentService.processCashPayment(body);
        break;

      default:
        return NextResponse.json(
          { message: 'Invalid payment method' },
          { status: 400 }
        );
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { message: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { message: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const paymentStatus = await GhanaPaymentService.getPaymentStatus(reference);
    
    if (!paymentStatus) {
      return NextResponse.json(
        { message: 'Payment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(paymentStatus);

  } catch (error) {
    console.error('Get payment status error:', error);
    return NextResponse.json(
      { message: 'Failed to get payment status' },
      { status: 500 }
    );
  }
}
