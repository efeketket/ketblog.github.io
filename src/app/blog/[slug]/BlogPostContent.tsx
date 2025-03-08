'use client';

import { Post } from '@/app/types/post';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiCalendar, FiEye, FiArrowLeft, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface BlogPostContentProps {
  post: Post;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminEmail = localStorage.getItem('adminEmail');
      const wasAdmin = isAdmin;
      setIsAdmin(!!adminEmail);
      
      // Eğer admin oturumu kapandıysa ve düzenleme modundaysa
      if (wasAdmin && !adminEmail && isEditing) {
        handleCancel();
      }
    };

    // İlk yüklemede kontrol et
    checkAdminStatus();

    // localStorage değişikliklerini dinle
    window.addEventListener('storage', checkAdminStatus);

    // URL'de edit=true varsa ve admin ise düzenleme modunu aç
    if (searchParams.get('edit') === 'true' && isAdmin) {
      setIsEditing(true);
    }

    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, [searchParams, isAdmin]);

  const handleSave = () => {
    // TODO: API'ye kaydetme işlemi eklenecek
    post.content = editedContent;
    post.title = editedTitle;
    setIsEditing(false);
    // URL'den edit parametresini kaldır
    router.replace(`/blog/${post.slug}`);
  };

  const handleCancel = () => {
    setEditedContent(post.content);
    setEditedTitle(post.title);
    setIsEditing(false);
    // URL'den edit parametresini kaldır
    router.replace(`/blog/${post.slug}`);
  };

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      {/* Geri Dönme Butonu */}
      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 group"
        >
          <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Ana Sayfaya Dön</span>
        </Link>

        {isAdmin && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiCheck className="w-4 h-4" />
                  <span>Kaydet</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  <span>İptal</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiEdit2 className="w-4 h-4" />
                <span>Düzenle</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full text-4xl font-bold bg-transparent border-b-2 border-indigo-600 dark:border-indigo-400 text-gray-900 dark:text-white mb-6 focus:outline-none"
          />
        ) : (
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>
        )}

        {/* Meta Bilgiler */}
        <div className="flex items-center gap-6 mb-8 text-sm text-gray-500 dark:text-gray-400">
          {/* Yazar Bilgisi */}
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
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

        {/* Etiketler */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag: string, index: number) => (
            <span 
              key={index}
              className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* İçerik */}
        <div className="prose prose-lg prose-gray dark:prose-invert dark:text-gray-300 max-w-none">
          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-[500px] bg-transparent border-2 border-indigo-600/20 dark:border-indigo-400/20 rounded-lg p-4 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
            />
          ) : (
            post.content
          )}
        </div>
      </div>
    </article>
  );
} 