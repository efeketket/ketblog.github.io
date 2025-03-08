import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { createToken } from '@/app/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log('Giriş isteği alındı:', email);

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('Kullanıcı bulunamadı:', email);
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Şifreyi kontrol et
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Geçersiz şifre:', email);
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    console.log('Giriş başarılı:', email);

    // Token oluştur
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    console.log('Token oluşturuldu');

    // Cookie'yi ayarla ve yanıt döndür
    const response = NextResponse.json({ 
      success: true,
      message: 'Giriş başarılı'
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 // 1 gün
    });

    console.log('Cookie ayarlandı, yanıt dönülüyor');
    return response;
  } catch (error) {
    console.error('Giriş hatası:', error);
    return NextResponse.json(
      { error: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 