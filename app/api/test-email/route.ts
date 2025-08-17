import { NextRequest, NextResponse } from 'next/server';
import { testEmailService, sendEmail } from '../../lib/emailService';

export async function GET(_request: NextRequest) {
  try {
    // Test the email service configuration
    const testResult = await testEmailService();
    
    return NextResponse.json({
      success: true,
      message: 'Email service test completed',
      result: testResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Email service test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Email service test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json();
    
    if (!to || !subject || !message) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: to, subject, message' 
        },
        { status: 400 }
      );
    }

    // Send a test email
    const emailSent = await sendEmail({
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Give Hope Foundation</h1>
            </div>
            <div class="content">
              <h2>Test Email</h2>
              <p>This is a test email to verify the email service configuration.</p>
              <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3>Message:</h3>
                <p>${message}</p>
              </div>
              <p>If you received this email, the email service is working correctly!</p>
            </div>
            <div class="footer">
              <p>© 2024 Give Hope Foundation. All rights reserved.</p>
              <p>This is a test email sent to: ${to}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Test Email\n\nThis is a test email to verify the email service configuration.\n\nMessage: ${message}\n\nIf you received this email, the email service is working correctly!`,
    });

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        to,
        subject,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send test email' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to send test email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
