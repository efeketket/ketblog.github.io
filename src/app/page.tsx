'use client';

import BlogPostCard from './components/BlogPostCard';
import { getPosts } from './lib/posts';
import { FiPlus, FiGrid, FiList } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Blog yazıları yüklenirken hata:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Yazıları</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('compact')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'compact'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('expanded')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'expanded'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiList className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={`grid gap-8 ${
        viewMode === 'compact'
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1'
      }`}>
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} viewMode={viewMode} />
        ))}
        
        <Link
          href="/blog/new"
          className={`group relative flex flex-col justify-center items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors ${
            viewMode === 'compact' ? 'h-[400px]' : 'h-[200px]'
          }`}
        >
          <div className="flex flex-col items-center gap-4 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            <FiPlus size={48} />
            <span className="text-xl font-medium">Yeni Blog Yazısı Ekle</span>
          </div>
        </Link>
      </div>
    </div>
  );
}