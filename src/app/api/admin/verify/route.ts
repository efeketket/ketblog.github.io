import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Token bulunamadı' },
        { status: 401 }
      );
    }

    // Token'ı doğrula
    const payload = verifyToken(token);

    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      authenticated: true,
      user: {
        email: payload.email,
        role: payload.role
      }
    });
  } catch (error) {
    console.error('Doğrulama hatası:', error);
    return NextResponse.json(
      { error: 'Doğrulama başarısız' },
      { status: 401 }
    );
  }
} 