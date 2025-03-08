import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Admin } from '@/app/types/admin';

const adminsFile = path.join(process.cwd(), 'public/data/admins.json');

// Admin profilini getir
export async function GET(request: Request) {
  try {
    const adminEmail = request.headers.get('X-Admin-Email');
    if (!adminEmail) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const content = await fs.readFile(adminsFile, 'utf8');
    const data = JSON.parse(content);
    const admin = data.admins.find((a: Admin) => a.email === adminEmail);

    if (!admin) {
      // Eğer admin profili yoksa, varsayılan profil döndür
      return NextResponse.json({
        email: adminEmail,
        nickname: 'Admin',
        avatar: '/images/default-avatar.jpg',
        bio: '',
        socialLinks: {}
      });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error('Admin profili getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Admin profili getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Admin profilini güncelle veya oluştur
export async function PUT(request: Request) {
  try {
    const adminEmail = request.headers.get('X-Admin-Email');
    if (!adminEmail) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const updatedProfile = await request.json();
    const content = await fs.readFile(adminsFile, 'utf8');
    const data = JSON.parse(content);
    
    const adminIndex = data.admins.findIndex((a: Admin) => a.email === adminEmail);
    
    if (adminIndex === -1) {
      // Yeni admin profili oluştur
      data.admins.push({
        ...updatedProfile,
        email: adminEmail
      });
    } else {
      // Mevcut profili güncelle
      data.admins[adminIndex] = {
        ...data.admins[adminIndex],
        ...updatedProfile,
        email: adminEmail // Email değiştirilemez
      };
    }

    await fs.writeFile(adminsFile, JSON.stringify(data, null, 2), 'utf8');
    return NextResponse.json(data.admins[adminIndex === -1 ? data.admins.length - 1 : adminIndex]);
  } catch (error) {
    console.error('Admin profili güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Admin profili güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 