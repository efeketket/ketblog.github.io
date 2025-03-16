'use server';

import fs from 'fs/promises';
import { join } from 'path';
import { formatCoverImagePath } from './utils';
import { Post } from '../types/post';

const DATA_PATH = join(process.cwd(), 'data', 'posts.json');
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

// Veri dosyasını oluştur (eğer yoksa)
async function initializePostsFile() {
  try {
    await fs.access(join(process.cwd(), 'data')).catch(async () => {
      await fs.mkdir(join(process.cwd(), 'data'));
    });

    await fs.access(DATA_PATH).catch(async () => {
      await fs.writeFile(DATA_PATH, JSON.stringify([], null, 2));
    });
  } catch (error) {
    console.error('Posts dosyası oluşturulurken hata:', error);
  }
}

// İlk çalıştırmada posts dosyasını oluştur
initializePostsFile();

// Basit veri işlemleri
export async function getPosts(): Promise<Post[]> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Posts okunurken hata:', error);
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
  await fs.writeFile(DATA_PATH, JSON.stringify(posts, null, 2));
  return post;
}

export async function updatePost(slug: string, updatedPost: Partial<Post>): Promise<Post | null> {
  const posts = await getPosts();
  const index = posts.findIndex(post => post.slug === slug);
  
  if (index === -1) return null;
  
  posts[index] = { ...posts[index], ...updatedPost, updatedAt: new Date().toISOString() };
  await fs.writeFile(DATA_PATH, JSON.stringify(posts, null, 2));
  
  return posts[index];
}

export async function deletePost(slug: string): Promise<boolean> {
  const posts = await getPosts();
  const filteredPosts = posts.filter(post => post.slug !== slug);
  
  if (filteredPosts.length === posts.length) return false;
  
  await fs.writeFile(DATA_PATH, JSON.stringify(filteredPosts, null, 2));
  return true;
} 