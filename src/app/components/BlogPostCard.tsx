'use client';

import { Post } from '@/app/types/post';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiCalendar, FiEdit2, FiImage, FiEye } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { calculateReadTime, formatDate } from '@/app/lib/utils';

interface BlogPostCardProps {
  post: Post;
  viewMode: 'compact' | 'expanded';
}

const DEFAULT_COVER = '/images/default-cover.jpg';
const DEFAULT_AVATAR = 'https://github.com/identicons/default.png';

export default function BlogPostCard({ post, viewMode }: BlogPostCardProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminEmail = localStorage.getItem('adminEmail');
      setIsAdmin(!!adminEmail);
    };

    checkAdminStatus();
    window.addEventListener('storage', checkAdminStatus);
    return () => window.removeEventListener('storage', checkAdminStatus);
  }, []);

  const isCompact = viewMode === 'compact';
  const showImage = post.coverImage && !imageError;
  const readTime = calculateReadTime(post.content);
  const formattedDate = formatDate(post.createdAt);

  return (
    <article className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
      isCompact ? 'h-[400px]' : ''
    }`}>
      {isAdmin && (
        <Link
          href={`/blog/${post.slug}?edit=true`}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiEdit2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </Link>
      )}

      <div className="flex flex-col h-full">
        {showImage ? (
          <div className={`relative ${isCompact ? 'h-48' : 'h-64'}`}>
            <Image
              src={post.coverImage || DEFAULT_COVER}
              alt={post.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className={`flex items-center justify-center ${isCompact ? 'h-32' : 'h-40'} bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/20 dark:to-indigo-900/5`}>
            <FiImage className="w-12 h-12 text-indigo-300 dark:text-indigo-600" />
          </div>
        )}

        <div className={`flex flex-col flex-grow ${isCompact ? 'p-6' : 'p-8'} ${!showImage ? 'justify-center' : ''}`}>
          <div className={`flex ${isCompact ? 'justify-between' : ''} items-center gap-4 mb-4`}>
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={post.author.avatar || DEFAULT_AVATAR}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <FiClock className="w-4 h-4" />
              <span>{readTime} dk</span>
            </div>
          </div>

          <Link href={`/blog/${post.slug}`}>
            <h2 className={`font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 ${
              isCompact ? 'text-xl' : 'text-2xl'
            }`}>
              {post.title}
            </h2>
          </Link>

          <p className={`text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 ${
            isCompact ? 'text-sm' : 'text-base'
          }`}>
            {post.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className={`mt-auto flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 ${
            isCompact ? 'justify-between' : 'justify-between'
          }`}>
            <div className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>

            <div className="flex items-center gap-1">
              <FiEye className="w-4 h-4" />
              <span>{post.views || 0} görüntülenme</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
} 