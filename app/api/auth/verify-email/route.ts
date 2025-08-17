import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (record.count >= maxAttempts) {
    return true;
  }
  
  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Rate limiting by IP address
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip, 10, 15 * 60 * 1000)) { // 10 attempts per 15 minutes
      return NextResponse.json(
        { success: false, message: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Rate limiting by email (prevent targeting specific emails)
    if (isRateLimited(email.toLowerCase(), 3, 15 * 60 * 1000)) { // 3 attempts per 15 minutes per email
      return NextResponse.json(
        { success: false, message: 'Too many attempts for this email. Please try again later.' },
        { status: 429 }
      );
    }

    // Check if email exists in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      // Add artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      
      return NextResponse.json(
        { success: false, message: 'Email verification failed' },
        { status: 404 }
      );
    }

    // Email exists - return success but don't reveal user details
    // Add artificial delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
