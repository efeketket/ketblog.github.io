import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { isAdmin } from '@/app/lib/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

// Blog yazısını getir
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Blog yazısını güncelle
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { title, content, excerpt, category, tags, published } = data;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        tags,
        published,
        readTime: `${Math.ceil(content.split(' ').length / 200)} dk okuma`
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Blog yazısını sil
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.post.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 