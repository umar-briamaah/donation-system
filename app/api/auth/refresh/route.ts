import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Refresh token is required' },
        { status: 400 }
      );
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JWTPayload;
      
      if (!decoded.userId) {
        throw new Error('Invalid refresh token payload');
      }

      // Check if user exists and token is valid
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          preferences: true,
          settings: true,
        }
      });

      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      // Verify refresh token in database (optional security check)
      if (user.settings?.refreshToken !== refreshToken) {
        return NextResponse.json(
          { message: 'Invalid refresh token' },
          { status: 401 }
        );
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (15 * 60), // 15 minutes
        },
        JWT_SECRET
      );

      // Generate new refresh token
      const newRefreshToken = jwt.sign(
        { 
          userId: user.id,
          tokenVersion: Date.now(),
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
        },
        JWT_REFRESH_SECRET
      );

      // Update refresh token in database
      await prisma.userSettings.update({
        where: { userId: user.id },
        data: {
          refreshToken: newRefreshToken,
          lastLogin: new Date(),
        }
      });

      // Return user data and new tokens
      const { password, ...userWithoutPassword } = user;
      
      return NextResponse.json({
        user: userWithoutPassword,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60, // 15 minutes in seconds
      });

    } catch (jwtError) {
      if (jwtError instanceof Error && jwtError.name === 'TokenExpiredError') {
        return NextResponse.json(
          { message: 'Refresh token expired' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
