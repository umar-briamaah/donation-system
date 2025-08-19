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

export async function GET(request: NextRequest) {
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
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      
      if (!decoded.userId) {
        throw new Error('Invalid token payload');
      }

      // Get user from database
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

      // Return user data without password
      const { password, ...userWithoutPassword } = user;
      
      return NextResponse.json(userWithoutPassword);

    } catch (jwtError) {
      if (jwtError instanceof Error && jwtError.name === 'TokenExpiredError') {
        return NextResponse.json(
          { message: 'Token expired' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
