import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../../../../lib/emailService';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone } = await request.json();

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check for password complexity (optional but recommended)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return NextResponse.json(
        { message: 'Password must contain uppercase, lowercase, and numbers' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { message: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Validate phone number if provided
    if (phone && phone.trim().length > 0) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        return NextResponse.json(
          { message: 'Please enter a valid phone number' },
          { status: 400 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name: name.trim(),
          phone: phone?.trim() || null,
          role: 'DONOR', // Default role
        },
        include: {
          preferences: true,
          settings: true,
        }
      });

      // Create default user preferences
      await tx.userPreferences.create({
        data: {
          userId: user.id,
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          anonymousDonations: false,
          recurringDonations: false,
          donationReminders: true,
          profileVisibility: 'PUBLIC',
          showDonationHistory: true,
          showEmailInDirectory: false,
          newsletterSubscribed: true,
          impactUpdates: true,
          causeRecommendations: true,
          preferredLanguage: 'en',
          timezone: 'Africa/Accra',
          currency: 'GHS',
        }
      });

      // Create default user settings
      await tx.userSettings.create({
        data: {
          userId: user.id,
          twoFactorEnabled: false,
          loginNotifications: true,
          sessionTimeout: 3600,
          autoLogout: true,
          rememberLogin: true,
          lastPasswordChange: new Date(),
          theme: 'light',
          fontSize: 'medium',
          compactMode: false,
          highContrast: false,
          screenReader: false,
          reducedMotion: false,
        }
      });

      return user;
    });

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { 
        userId: result.id, 
        email: result.email, 
        role: result.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
      },
      JWT_SECRET
    );

    const refreshToken = jwt.sign(
      { 
        userId: result.id,
        tokenVersion: Date.now(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      },
      JWT_REFRESH_SECRET
    );

    // Store refresh token
    await prisma.userSettings.update({
      where: { userId: result.id },
      data: {
        refreshToken,
        lastLogin: new Date(),
      }
    });

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail({
        email: result.email,
        name: result.name,
      });
      console.log(`Welcome email sent to: ${result.email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }

    // Log successful registration
    console.log(`New user registered: ${email} (${result.role})`);

    // Return user data and tokens (without password)
    const { password: _passwordRemoved, ...userWithoutPassword } = result;
    
    return NextResponse.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
      message: 'User registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
