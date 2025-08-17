import { NextRequest, NextResponse } from 'next/server';
import { GhanaPaymentService } from '@/lib/paymentService';

export async function POST(request: NextRequest) {
  try {
    const { reference, transactionId } = await request.json();

    if (!reference || !transactionId) {
      return NextResponse.json(
        { message: 'Reference and transaction ID are required' },
        { status: 400 }
      );
    }

    const response = await GhanaPaymentService.verifyBankTransfer(reference, transactionId);

    return NextResponse.json(response);

  } catch (error) {
    console.error('Bank transfer verification error:', error);
    return NextResponse.json(
      { message: 'Failed to verify bank transfer' },
      { status: 500 }
    );
  }
}
