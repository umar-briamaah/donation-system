import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const data = JSON.parse(body);
    
    console.log('Test webhook received:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      body: data,
      timestamp: new Date().toISOString(),
    });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test webhook processed successfully',
      receivedAt: new Date().toISOString(),
      data: data
    });
    
  } catch (error) {
    console.error('Error processing test webhook:', error);
    
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'Test webhook processing failed'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test Webhook Endpoint',
    status: 'active',
    timestamp: new Date().toISOString(),
    instructions: [
      'Send a POST request to this endpoint with any JSON data',
      'Check the console logs to see the webhook data',
      'Use this to test webhook delivery and processing'
    ]
  });
}
