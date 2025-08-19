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
      console.log('Refresh token API: No refresh token provided');
      return NextResponse.json(
        { message: 'Refresh token is required' },
        { status: 400 }
      );
    }

    try {
      console.log('Refresh token API: Attempting to verify refresh token');
      
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JWTPayload;
      
      if (!decoded.userId) {
        console.log('Refresh token API: Invalid refresh token payload - no userId');
        throw new Error('Invalid refresh token payload');
      }

      console.log('Refresh token API: Token verified, userId:', decoded.userId);

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          preferences: true,
          settings: true,
        }
      });

      if (!user) {
        console.log('Refresh token API: User not found for userId:', decoded.userId);
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }

      console.log('Refresh token API: User found, settings exist:', !!user.settings);

      // Check if user settings exist, if not create them
      let userSettings = user.settings;
      if (!userSettings) {
        console.log('Refresh token API: Creating user settings for userId:', decoded.userId);
        userSettings = await prisma.userSettings.create({
          data: {
            userId: user.id,
            refreshToken: refreshToken, // Store the current refresh token
          }
        });
        console.log('Refresh token API: User settings created successfully');
      } else {
        console.log('Refresh token API: Verifying refresh token against database');
        // Verify refresh token in database (optional security check)
        if (userSettings.refreshToken !== refreshToken) {
          console.log('Refresh token API: Database token mismatch - clearing old tokens');
          
          // Clear the mismatched token from database to force re-authentication
          await prisma.userSettings.update({
            where: { userId: user.id },
            data: {
              refreshToken: null,
              lastLogout: new Date(),
            }
          });
          
          return NextResponse.json(
            { 
              message: 'Token mismatch - please login again',
              code: 'TOKEN_MISMATCH',
              requiresReauth: true
            },
            { status: 401 }
          );
        }
        console.log('Refresh token API: Database token verified successfully');
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

      console.log('Refresh token API: Generated new tokens, updating database');

      // Update refresh token in database
      await prisma.userSettings.update({
        where: { userId: user.id },
        data: {
          refreshToken: newRefreshToken,
          lastLogin: new Date(),
        }
      });

      console.log('Refresh token API: Database updated successfully');

      // Return user data and new tokens
      const { password, ...userWithoutPassword } = user;
      
      return NextResponse.json({
        user: userWithoutPassword,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 15 * 60, // 15 minutes in seconds
      });

    } catch (jwtError) {
      console.error('Refresh token API: JWT verification error:', jwtError);
      
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
    console.error('Refresh token API: General error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
