import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, savePost, deletePost } from '@/app/lib/posts';

// GET /api/posts/[slug] - Belirli bir blog yazısını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    // Görüntülenme sayısını artır
    const updatedPost = {
      ...post,
      views: (post.views || 0) + 1,
      trendScore: calculateTrendScore(post.views || 0, post.createdAt)
    };

    await savePost(updatedPost);
    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: 'Blog yazısı alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - Blog yazısını güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const adminEmail = request.headers.get('x-admin-email');
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const existingPost = await getPostBySlug(params.slug);
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const updatedPost = await savePost({
      ...existingPost,
      ...data,
      slug: params.slug,
      views: existingPost.views || 0,
      trendScore: calculateTrendScore(existingPost.views || 0, existingPost.createdAt),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: 'Blog yazısı güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] - Blog yazısını sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const adminEmail = request.headers.get('x-admin-email');
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const success = await deletePost(params.slug);
    if (!success) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Blog yazısı silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

function calculateTrendScore(views: number, createdAt: string): number {
  const now = new Date();
  const created = new Date(createdAt);
  const daysSinceCreation = Math.max(1, Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Son 7 gün içindeyse trend skorunu hesapla
  if (daysSinceCreation <= 7) {
    return views / daysSinceCreation;
  }
  
  // 7 günden eskiyse trend skorunu azalt
  return (views / daysSinceCreation) * 0.5;
} 