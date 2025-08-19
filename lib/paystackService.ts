import crypto from 'crypto';

// Paystack API configuration
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Types
export interface PaymentRequest {
  amount: number;
  email: string;
  reference: string;
  callbackUrl: string;
  metadata?: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    amount: number;
    currency: string;
    status: string;
    reference: string;
    gateway_response: string;
    paid_at: string;
    channel: string;
    ip_address: string;
    metadata: Record<string, unknown>;
    fees: number;
    customer: {
      id: number;
      email: string;
      customer_code: string;
      first_name: string;
      last_name: string;
      phone: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
  };
}

// Utility functions
export function convertToKobo(amount: number, currency: string): number {
  // Convert amount to smallest currency unit
  // For GHS (Ghana Cedi): 1 GHS = 100 pesewas
  // For NGN (Nigerian Naira): 1 NGN = 100 kobo
  // For USD: 1 USD = 100 cents
  // For EUR: 1 EUR = 100 cents
  
  const multipliers: { [key: string]: number } = {
    'GHS': 100,  // Ghana Cedi to pesewas
    'NGN': 100,  // Nigerian Naira to kobo
    'USD': 100,  // US Dollar to cents
    'EUR': 100,  // Euro to cents
  };
  
  return Math.round(amount * (multipliers[currency] || 100));
}

export function generateReference(): string {
  // Generate a unique reference for the payment
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `DON_${timestamp}_${random}`.toUpperCase();
}

// Paystack API functions
export async function initializePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key not configured');
  }

  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Paystack API error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error initializing Paystack payment:', error);
    throw error;
  }
}

export async function verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key not configured');
  }

  try {
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Paystack API error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying Paystack payment:', error);
    throw error;
  }
}

export async function createCustomer(email: string, firstName?: string, lastName?: string): Promise<Record<string, unknown>> {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error('Paystack secret key not configured');
  }

  try {
    const customerData: Record<string, unknown> = { email };
    if (firstName) customerData.first_name = firstName;
    if (lastName) customerData.last_name = lastName;

    const response = await fetch(`${PAYSTACK_BASE_URL}/customer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Paystack API error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating Paystack customer:', error);
    throw error;
  }
}

export async function testConnection(): Promise<{ success: boolean; message: string; details?: Record<string, unknown> }> {
  try {
    // Test the connection by making a simple API call
    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/totals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Successfully connected to Paystack API',
        details: { status: response.status, statusText: response.statusText }
      };
    } else {
      return {
        success: false,
        message: `Failed to connect to Paystack API: ${response.status} ${response.statusText}`,
        details: { status: response.status, statusText: response.statusText }
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error connecting to Paystack API',
      details: error instanceof Error ? { message: error.message, stack: error.stack } : { error: String(error) }
    };
  }
}

// Webhook signature verification
export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const hash = crypto
      .createHmac('sha512', secret)
      .update(payload)
      .digest('hex');
    return hash === signature;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
}
