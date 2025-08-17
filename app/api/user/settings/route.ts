import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

// Get user settings
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

    const settings = await prisma.userSettings.findUnique({
      where: { userId }
    });

    if (!settings) {
      return NextResponse.json(
        { success: false, message: 'Settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update user settings
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

    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        ...updateData
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
