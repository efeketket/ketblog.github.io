import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const tagsFile = path.join(process.cwd(), 'public/data/tags.json');

// Tüm etiketleri getir
export async function GET() {
  try {
    const content = await fs.readFile(tagsFile, 'utf8');
    const data = JSON.parse(content);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Etiketler getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Etiketler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Yeni etiket ekle
export async function POST(request: Request) {
  try {
    const { tag } = await request.json();
    
    // Admin kontrolü
    const adminEmail = request.headers.get('X-Admin-Email');
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const content = await fs.readFile(tagsFile, 'utf8');
    const data = JSON.parse(content);
    
    // Etiket zaten varsa ekleme
    if (data.tags.includes(tag)) {
      return NextResponse.json(
        { error: 'Bu etiket zaten mevcut' },
        { status: 400 }
      );
    }
    
    // Yeni etiketi ekle
    data.tags.push(tag);
    await fs.writeFile(tagsFile, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Etiket eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Etiket eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 