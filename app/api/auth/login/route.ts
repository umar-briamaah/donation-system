import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
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

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        preferences: true,
        settings: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user account is active
    if (user.role === 'ADMIN' && !user.settings?.twoFactorEnabled) {
      // For admin accounts, you might want additional security checks
      console.log(`Admin login attempt: ${email}`);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Log failed login attempt for security monitoring
      console.log(`Failed login attempt for email: ${email}`);
      
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT tokens
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
      },
      JWT_SECRET
    );

    const refreshToken = jwt.sign(
      { 
        userId: user.id,
        tokenVersion: Date.now(), // For token invalidation
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      },
      JWT_REFRESH_SECRET
    );

    // Store refresh token in database (optional for token invalidation)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        settings: {
          upsert: {
            create: {
              refreshToken,
              lastLogin: new Date(),
            },
            update: {
              refreshToken,
              lastLogin: new Date(),
            }
          }
        }
      }
    });

    // Log successful login
    console.log(`Successful login: ${email} (${user.role})`);

    // Return user data and tokens (without password)
    const { password: _passwordRemoved, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
