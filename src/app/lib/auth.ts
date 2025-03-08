import { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    throw new Error('Invalid token');
  }
}

export function getTokenFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Cookie'den token'ı al
  const cookieStore = cookies();
  return cookieStore.get('token')?.value;
}

export async function isAuthenticated(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return null;

    const payload = verifyToken(token);
    return payload;
  } catch {
    return null;
  }
}

export async function isAdmin(req: NextRequest) {
  const user = await isAuthenticated(req);
  return user?.role === 'ADMIN';
} 