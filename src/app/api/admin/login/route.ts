import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { createToken, generateToken } from '@/app/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';
import { sign } from 'jsonwebtoken';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Gerçek uygulamada environment variable kullanılmalı

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }

    // Token oluştur
    const token = generateToken(email);

    // Response oluştur ve cookie'leri ayarla
    const response = NextResponse.json(
      { message: 'Giriş başarılı' },
      { status: 200 }
    );

    // Cookie'leri ayarla (30 gün)
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    response.cookies.set('token', token, {
      path: '/',
      maxAge: thirtyDays,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    response.cookies.set('adminEmail', email, {
      path: '/',
      maxAge: thirtyDays,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    console.error('Login hatası:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi başarısız' },
      { status: 500 }
    );
  }
} 