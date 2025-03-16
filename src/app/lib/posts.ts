'use server';

import { promises as fs } from 'node:fs';
import path from 'path';
import { formatCoverImagePath } from './utils';
import { Post } from '../types/post';

const postsDirectory = path.join(process.cwd(), 'data');
const postsFile = path.join(postsDirectory, 'posts.json');
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
    const fileContents = await fs.readFile(postsFile, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find(post => post.slug === slug) || null;
}

// Trend skorunu hesapla
function calculateTrendScore(views: number, createdAt: string): number {
  const now = new Date();
  const postDate = new Date(createdAt);
  const daysSinceCreation = Math.max(1, Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Son 7 gün içindeki postlar için ek ağırlık
  const recencyBonus = daysSinceCreation <= 7 ? 1.5 : 1;
  
  // Günlük ortalama görüntülenme * recencyBonus
  return (views / daysSinceCreation) * recencyBonus;
}

export async function savePost(post: Post): Promise<Post> {
  const posts = await getPosts();
  posts.push(post);
  await fs.writeFile(postsFile, JSON.stringify(posts, null, 2));
  return post;
}

export async function updatePost(slug: string, updatedPost: Partial<Post>): Promise<Post | null> {
  const posts = await getPosts();
  const index = posts.findIndex(post => post.slug === slug);
  
  if (index === -1) return null;
  
  posts[index] = { ...posts[index], ...updatedPost, updatedAt: new Date().toISOString() };
  await fs.writeFile(postsFile, JSON.stringify(posts, null, 2));
  
  return posts[index];
}

export async function deletePost(slug: string): Promise<boolean> {
  const posts = await getPosts();
  const filteredPosts = posts.filter(post => post.slug !== slug);
  
  if (filteredPosts.length === posts.length) return false;
  
  await fs.writeFile(postsFile, JSON.stringify(filteredPosts, null, 2));
  return true;
} 