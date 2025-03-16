import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, updatePost, deletePost } from '@/app/lib/posts';

interface RouteParams {
  params: {
    id: string;
  };
}

// Blog yazısını getir
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const post = await getPostBySlug(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post bulunamadı' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
  }
}

// Blog yazısını güncelle
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const post = await request.json();
    const updatedPost = await updatePost(params.id, post);
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ error: 'Güncelleme sırasında bir hata oluştu' }, { status: 500 });
  }
}

// Blog yazısını sil
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await deletePost(params.id);
    return NextResponse.json({ message: 'Post başarıyla silindi' });
  } catch (error) {
    return NextResponse.json({ error: 'Silme sırasında bir hata oluştu' }, { status: 500 });
  }
} 