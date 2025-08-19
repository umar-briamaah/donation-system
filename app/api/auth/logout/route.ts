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

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization header missing or invalid' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify JWT token to get user ID
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      
      if (!decoded.userId) {
        return NextResponse.json(
          { message: 'Invalid token' },
          { status: 401 }
        );
      }

      // Invalidate refresh token in database
      await prisma.userSettings.update({
        where: { userId: decoded.userId },
        data: {
          refreshToken: null,
          lastLogout: new Date(),
        }
      });

      // Log logout activity
      console.log(`User logged out: ${decoded.userId}`);

      return NextResponse.json({
        message: 'Logged out successfully'
      });

    } catch (_jwtError) {
      // Even if token is invalid, we can still process logout
      console.log('Logout with invalid token attempted');
      
      return NextResponse.json({
        message: 'Logged out successfully'
      });
    }

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
