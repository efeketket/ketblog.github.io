import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { isAdmin } from '@/app/lib/auth';

// Blog yazılarını listele
export async function GET(req: NextRequest) {
  try {
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Yeni blog yazısı oluştur
export async function POST(req: NextRequest) {
  try {
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { title, content, excerpt, category, tags, authorId } = data;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        tags,
        authorId,
        readTime: `${Math.ceil(content.split(' ').length / 200)} dk okuma`
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 