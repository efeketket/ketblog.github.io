'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiUser, FiList } from 'react-icons/fi';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'posts'>('profile');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/profile', {
          headers: {
            'X-Admin-Email': localStorage.getItem('adminEmail') || ''
          }
        });

        if (!response.ok) {
          throw new Error('Unauthorized');
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        router.replace('/admin/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Paneli
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiUser className="w-5 h-5" />
            <span>Profil</span>
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'posts'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FiList className="w-5 h-5" />
            <span>Blog Yazıları</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {activeTab === 'profile' ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Admin Profili
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Giriş yapılan email: {localStorage.getItem('adminEmail')}
            </p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Blog Yazıları
              </h2>
              <button
                onClick={() => router.push('/blog/new')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FiEdit2 className="w-5 h-5" />
                <span>Yeni Yazı</span>
              </button>
            </div>
            {/* Blog yazıları listesi buraya gelecek */}
          </div>
        )}
      </div>
    </div>
  );
} 