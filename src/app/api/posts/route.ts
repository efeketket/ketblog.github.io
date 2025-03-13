import { NextRequest, NextResponse } from 'next/server';
import { getPosts, savePost, getPostBySlug, deletePost } from '@/app/lib/posts';
import slugify from 'slugify';

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Blog yazıları alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminEmail = request.headers.get('x-admin-email');
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { title, description, content, tags = [], coverImage, author } = data;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Başlık ve içerik zorunludur' },
        { status: 400 }
      );
    }

    const slug = slugify(title, { lower: true, strict: true });
    const existingPost = await getPostBySlug(slug);
    
    if (existingPost) {
      return NextResponse.json(
        { error: 'Bu başlıkta bir yazı zaten mevcut' },
        { status: 400 }
      );
    }

    const newPost = {
      slug,
      title,
      description: description || '',
      content,
      coverImage,
      author: author || { name: 'Admin' },
      tags,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedPost = await savePost(newPost);
    return NextResponse.json(savedPost);
  } catch (error) {
    return NextResponse.json(
      { error: 'Blog yazısı oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 