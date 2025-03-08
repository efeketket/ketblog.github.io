'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '../types/post';
import Image from 'next/image';
import { FiClock, FiCalendar, FiEye, FiEdit2 } from 'react-icons/fi';

interface BlogPostProps {
  post: Post;
}

export default function BlogPost({ post }: BlogPostProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminEmail = localStorage.getItem('adminEmail');
    setIsAdmin(!!adminEmail);
  }, []);

  const handleCardClick = (e: React.MouseEvent) => {
    // Eğer tıklanan element buton, etiket veya düzenleme butonu değilse blog sayfasına yönlendir
    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('.tag') && !target.closest('.edit-button')) {
      router.push(`/blog/${post.slug}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blog/${post.slug}?edit=true`);
  };

  return (
    <article 
      onClick={handleCardClick}
      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden 
        hover:bg-indigo-50 dark:hover:bg-gray-700/50 
        hover:border-indigo-100 dark:hover:border-indigo-900 
        border-2 border-transparent
        cursor-pointer
        transform hover:scale-[1.02]"
    >
      {isAdmin && (
        <button 
          onClick={handleEditClick}
          className="edit-button absolute top-4 right-4 p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 
            rounded-full hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors duration-200 z-10"
        >
          <FiEdit2 className="w-5 h-5" />
        </button>
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
          {post.title}
        </h3>
        
        {/* Meta Bilgiler */}
        <div className="flex items-center gap-6 mb-4 text-sm text-gray-500 dark:text-gray-400">
          {/* Yazar Bilgisi */}
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image 
                src={post.author.avatar} 
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span>{post.author.name}</span>
          </div>

          {/* Tarih */}
          <div className="flex items-center gap-1">
            <FiCalendar className="w-4 h-4" />
            <span>{post.createdAt}</span>
          </div>

          {/* Okuma Süresi */}
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4" />
            <span>{post.readTime} dk okuma</span>
          </div>

          {/* Görüntülenme */}
          <div className="flex items-center gap-1">
            <FiEye className="w-4 h-4" />
            <span>{post.views} görüntülenme</span>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">{post.description}</p>
        
        {/* Etiketler */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag: string, index: number) => (
            <span 
              key={index}
              className="tag px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full
                transition-colors duration-200 hover:bg-indigo-200 dark:hover:bg-indigo-800"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Genişleyen İçerik */}
        <div 
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-[300px] opacity-100 mb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="text-gray-600 dark:text-gray-300 line-clamp-6">
            {post.content}
          </p>
        </div>

        {/* Alt Kısım */}
        <div className="flex items-center justify-end mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 
              font-medium transition-colors duration-200
              hover:underline hover:underline-offset-4"
          >
            {isExpanded ? 'Daha Az Göster ↑' : 'Devamını Oku ↓'}
          </button>
        </div>
      </div>
    </article>
  );
} 