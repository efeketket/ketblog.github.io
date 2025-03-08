import { Post } from '../types/post';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const DEFAULT_AVATAR = 'https://github.com/identicons/default.png';

// Tüm blog yazılarını getir
export async function getAllPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/posts`);
    if (!response.ok) {
      throw new Error('Blog yazıları alınamadı');
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Blog yazıları alınırken hata:', error);
    return [];
  }
}

// Sayfalanmış blog yazılarını getir
export async function getPaginatedPosts(page: number = 1, postsPerPage: number = 10) {
  try {
    const posts = await getAllPosts();
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = posts.slice(startIndex, endIndex);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    return {
      posts: paginatedPosts,
      totalPages,
      total: posts.length
    };
  } catch (error) {
    console.error('Sayfalı blog yazıları alınırken hata:', error);
    return {
      posts: [],
      totalPages: 0,
      total: 0
    };
  }
}

// Slug'a göre blog yazısı getir
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const response = await fetch(`${BASE_URL}/api/posts/${encodedSlug}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Blog yazısı alınırken hata:', error);
    return null;
  }
}

// Yeni blog yazısı ekle
export async function createPost(post: Omit<Post, 'slug' | 'createdAt' | 'updatedAt'>): Promise<Post> {
  try {
    // Admin kontrolü
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      throw new Error('Admin girişi yapılmamış');
    }

    // Yazar avatarı kontrolü
    if (!post.author.avatar) {
      post.author.avatar = DEFAULT_AVATAR;
    }

    const response = await fetch(`${BASE_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Email': adminEmail,
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Blog yazısı oluşturulurken bir hata oluştu');
    }

    return await response.json();
  } catch (error) {
    console.error('Blog yazısı oluşturulurken hata:', error);
    throw error;
  }
}

// Blog yazısını güncelle
export async function updatePost(slug: string, updatedPost: Partial<Post>): Promise<Post | null> {
  try {
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      throw new Error('Admin girişi yapılmamış');
    }

    // Yazar avatarı kontrolü
    if (updatedPost.author && !updatedPost.author.avatar) {
      updatedPost.author.avatar = DEFAULT_AVATAR;
    }

    const encodedSlug = encodeURIComponent(slug);
    const response = await fetch(`${BASE_URL}/api/posts/${encodedSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Email': adminEmail,
      },
      body: JSON.stringify(updatedPost),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Blog yazısı güncellenirken bir hata oluştu');
    }

    return await response.json();
  } catch (error) {
    console.error('Blog yazısı güncellenirken hata:', error);
    throw error;
  }
}

// Blog yazısını sil
export async function deletePost(slug: string): Promise<boolean> {
  try {
    const adminEmail = localStorage.getItem('adminEmail');
    if (!adminEmail) {
      throw new Error('Admin girişi yapılmamış');
    }

    const encodedSlug = encodeURIComponent(slug);
    const response = await fetch(`${BASE_URL}/api/posts/${encodedSlug}`, {
      method: 'DELETE',
      headers: {
        'X-Admin-Email': adminEmail,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Blog yazısı silinirken hata:', error);
    throw error;
  }
} 