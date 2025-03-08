import { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export interface TokenPayload {
  email: string;
  role: string;
  exp: number;
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error('Geçersiz token');
  }
}

export function generateToken(email: string): string {
  return jwt.sign(
    { 
      email, 
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 gün
    },
    JWT_SECRET
  );
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