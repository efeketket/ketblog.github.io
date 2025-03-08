import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Post } from '@/app/types/post';

const postsFile = path.join(process.cwd(), 'public/data/posts.json');

// POST /api/posts/save - Blog yazılarını kaydet
export async function POST(request: Request) {
  try {
    const { posts } = await request.json();

    // Admin kontrolü
    const adminEmail = request.headers.get('X-Admin-Email');
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    // JSON dosyasına yaz
    await fs.writeFile(postsFile, JSON.stringify({ posts }, null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving posts:', error);
    return NextResponse.json(
      { error: 'Blog yazıları kaydedilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 