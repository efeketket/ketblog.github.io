'use server';

import { promises as fs } from 'node:fs';
import path from 'path';

const postsFile = path.join(process.cwd(), 'data', 'posts.json');
const DEFAULT_AVATAR = 'https://github.com/identicons/default.png';

// Okuma süresini hesapla (dakika cinsinden)
export async function calculateReadTime(content: string): Promise<number> {
  const wordsPerMinute = 200; // Ortalama okuma hızı
  const words = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(words / wordsPerMinute);
  return Math.max(1, readTime); // En az 1 dakika
}

// Tarihi formatla
export async function formatDate(dateString: string): Promise<string> {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Posts dosyasını oluştur (eğer yoksa)
async function initializePostsFile() {
  try {
    await fs.access(path.join(process.cwd(), 'data')).catch(async () => {
      await fs.mkdir(path.join(process.cwd(), 'data'));
    });

    await fs.access(postsFile).catch(async () => {
      await fs.writeFile(postsFile, JSON.stringify({ posts: [] }, null, 2));
    });
  } catch (error) {
    console.error('Posts dosyası oluşturulurken hata:', error);
  }
}

// İlk çalıştırmada posts dosyasını oluştur
initializePostsFile();

export async function getPosts(): Promise<Post[]> {
  try {
    const fileContent = await fs.readFile(postsFile, 'utf-8');
    const data = JSON.parse(fileContent);
    return Array.isArray(data.posts) ? data.posts : [];
  } catch (error) {
    console.error('Posts okunurken hata:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const posts = await getPosts();
    return posts.find((post: Post) => post.slug === slug) || null;
  } catch (error) {
    console.error('Blog yazısı alınırken hata:', error);
    return null;
  }
}

export async function savePost(post: Post): Promise<Post> {
  try {
    const posts = await getPosts();
    const existingPostIndex = posts.findIndex((p: Post) => p.slug === post.slug);

    if (existingPostIndex >= 0) {
      posts[existingPostIndex] = post;
    } else {
      posts.push(post);
    }

    await fs.writeFile(postsFile, JSON.stringify({ posts }, null, 2));
    return post;
  } catch (error) {
    console.error('Post kaydedilirken hata:', error);
    throw new Error('Post kaydedilemedi');
  }
}

export async function deletePost(slug: string): Promise<boolean> {
  try {
    const posts = await getPosts();
    const filteredPosts = posts.filter((post: Post) => post.slug !== slug);
    
    if (filteredPosts.length === posts.length) {
      return false;
    }

    await fs.writeFile(postsFile, JSON.stringify({ posts: filteredPosts }, null, 2));
    return true;
  } catch (error) {
    console.error('Post silinirken hata:', error);
    throw new Error('Post silinemedi');
  }
} 