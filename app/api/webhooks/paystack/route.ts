import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { verifyPayment } from '../../../../lib/paystackService';

const prisma = new PrismaClient();

// Verify Paystack webhook signature
function verifyWebhookSignature(request: NextRequest, body: string): boolean {
  try {
    const signature = request.headers.get('x-paystack-signature');
    
    if (!signature || !process.env.PAYSTACK_WEBHOOK_SECRET) {
      console.log('Missing signature or webhook secret');
      return false;
    }
    
    // Create expected signature
    const expectedSignature = createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');
    
    const isValid = signature === expectedSignature;
    console.log(`Webhook signature verification: ${isValid ? 'SUCCESS' : 'FAILED'}`);
    
    return isValid;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}

// Update payment and donation status in database
async function updatePaymentStatus(reference: string, status: string, paymentData?: Record<string, unknown>) {
  try {
    // First update the payment record
    const paymentUpdateData: Record<string, unknown> = {
      status: status,
      updatedAt: new Date(),
    };
    
    if (paymentData) {
      if (paymentData.paid_at && typeof paymentData.paid_at === 'string') {
        paymentUpdateData.processedAt = new Date(paymentData.paid_at);
      }
      if (paymentData.channel && typeof paymentData.channel === 'string') {
        paymentUpdateData.provider = paymentData.channel;
      }
      if (paymentData.fees && typeof paymentData.fees === 'number') {
        paymentUpdateData.metadata = { fees: paymentData.fees / 100 }; // Convert from kobo
      }
    }
    
    const payment = await prisma.payment.update({
      where: { reference: reference },
      data: paymentUpdateData,
      include: {
        donation: {
          include: {
            user: true,
            cause: true,
          }
        }
      },
    });
    
    // Then update the donation status
    const donationUpdateData: Record<string, unknown> = {
      status: status,
      updatedAt: new Date(),
    };
    
    if (status === 'COMPLETED') {
      donationUpdateData.donatedAt = new Date();
    }
    
    const donation = await prisma.donation.update({
      where: { id: payment.donation.id },
      data: donationUpdateData,
      include: {
        user: true,
        cause: true,
      },
    });
    
    console.log(`Payment ${reference} and donation ${donation.id} status updated to ${status}`);
    return donation;
  } catch (error) {
    console.error(`Error updating payment ${reference}:`, error);
    throw error;
  }
}

// Send notification to user about payment status
async function sendPaymentNotification(donation: Record<string, unknown>, status: string) {
  try {
    // You can implement email/SMS notifications here
    const user = donation.user as Record<string, unknown>;
    const cause = donation.cause as Record<string, unknown>;
    
    if (user && user.email && typeof user.email === 'string') {
      console.log(`Payment ${status} notification sent to ${user.email}`);
      
      // Example: Send email notification
      // await sendEmail({
      //   to: user.email,
      //   subject: `Donation ${status} - ${cause?.title || 'Unknown Cause'}`,
      //   html: `Your donation of ${donation.currency} ${donation.amount} has been ${status.toLowerCase()}.`
      // });
    }
  } catch (error) {
    console.error('Error sending payment notification:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const data = JSON.parse(body);
    
    console.log('Paystack webhook received:', {
      event: data.event,
      reference: data.data?.reference,
      status: data.data?.status,
      amount: data.data?.amount,
      channel: data.data?.channel,
    });
    
    // Verify webhook signature for security
    if (!verifyWebhookSignature(request, body)) {
      console.log('Webhook signature verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { event, data: paymentData } = data;
    
    // Handle different webhook events
    switch (event) {
      case 'charge.success':
        await handleSuccessfulPayment(paymentData);
        break;
        
      case 'charge.failed':
        await handleFailedPayment(paymentData);
        break;
        
      case 'transfer.success':
        console.log('Transfer successful:', paymentData.reference);
        break;
        
      case 'transfer.failed':
        console.log('Transfer failed:', paymentData.reference);
        break;
        
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }
    
    // Return success response to Paystack
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully'
    });
    
  } catch (error) {
    console.error('Error processing Paystack webhook:', error);
    
    // Return error response (Paystack will retry)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Webhook processing failed'
    }, { status: 500 });
  }
}

// Handle successful payment
async function handleSuccessfulPayment(paymentData: Record<string, unknown>) {
  try {
    const { reference, status } = paymentData;
    
    if (status === 'success' && reference && typeof reference === 'string') {
      // Verify payment with Paystack API for additional security
      const verification = await verifyPayment(reference);
      
      if (verification.status && verification.data) {
        const donation = await updatePaymentStatus(reference, 'COMPLETED', verification.data);
        
        if (donation) {
          await sendPaymentNotification(donation, 'COMPLETED');
          console.log(`Payment completed successfully: ${reference}`);
        }
      } else {
        console.log(`Payment verification failed for: ${reference}`);
      }
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

// Handle failed payment
async function handleFailedPayment(paymentData: Record<string, unknown>) {
  try {
    const { reference, status, gateway_response } = paymentData;
    
    if (status === 'failed' && reference && typeof reference === 'string') {
      const donation = await updatePaymentStatus(reference, 'FAILED');
      
      if (donation) {
        await sendPaymentNotification(donation, 'FAILED');
        console.log(`Payment failed: ${reference} - ${gateway_response}`);
      }
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  return NextResponse.json({ 
    message: 'Paystack Webhook Endpoint',
    status: 'active',
    timestamp: new Date().toISOString(),
    instructions: [
      'Configure this URL in your Paystack dashboard',
      'Webhook secret must match PAYSTACK_WEBHOOK_SECRET',
      'Supported events: charge.success, charge.failed, transfer.success, transfer.failed'
    ]
  });
}
