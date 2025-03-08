'use client';
import { useState } from 'react';
import BlogPost from './components/BlogPost';
import Pagination from './components/Pagination';
import { getPaginatedPosts } from './services/blogService';

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const { posts, totalPages } = getPaginatedPosts(currentPage);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Blog Başlığı */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ketket&apos;s Developments
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Yazılım geliştirme üzerine deneyimler ve öğrendiklerim
          </p>
        </div>

        {/* Blog Listesi */}
        <div className="space-y-6">
          {posts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>

        {/* Sayfalama */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </main>
  );
}