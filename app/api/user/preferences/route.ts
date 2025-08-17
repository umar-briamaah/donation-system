import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Get user preferences
export async function GET(request: NextRequest) {
  try {
    // In a real app, get user ID from authentication token
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required' },
        { status: 401 }
      );
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId }
    });

    if (!preferences) {
      return NextResponse.json(
        { success: false, message: 'Preferences not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      preferences
    });

  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user preferences
export async function PUT(request: NextRequest) {
  try {
    // In a real app, get user ID from authentication token
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required' },
        { status: 401 }
      );
    }

    const updateData = await request.json();

    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Preferences updated successfully',
      preferences
    });

  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
