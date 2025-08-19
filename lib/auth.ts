import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// Get authentication headers from request
export function getAuthHeaders(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  return {
    Authorization: authHeader || '',
    token: token || '',
  };
}

// Verify JWT token
export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }
    
    const decoded = verify(token, process.env.JWT_SECRET);
    if (typeof decoded === 'string') {
      return null;
    }
    return decoded as Record<string, unknown>;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Extract user ID from token
export function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = verifyToken(token);
    if (decoded && typeof decoded === 'object') {
      const userId = decoded.userId || decoded.id;
      if (typeof userId === 'string') {
        return userId;
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to extract user ID from token:', error);
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(request: NextRequest): boolean {
  const authHeaders = getAuthHeaders(request);
  return !!authHeaders.token;
}

// Get user from request headers
export async function getUserFromRequest(request: NextRequest) {
  try {
    const authHeaders = getAuthHeaders(request);
    
    if (!authHeaders.token) {
      return null;
    }

    // Verify the token
    const decoded = verifyToken(authHeaders.token);
    if (!decoded) {
      return null;
    }

    return {
      id: decoded.userId || decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
    };
  } catch (error) {
    console.error('Failed to get user from request:', error);
    return null;
  }
}
