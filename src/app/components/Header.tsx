'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminEmail = localStorage.getItem('adminEmail');
      setIsAdmin(!!adminEmail);
    };

    checkAdminStatus();
    setMounted(true);
    window.addEventListener('storage', checkAdminStatus);
    return () => window.removeEventListener('storage', checkAdminStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            Blog
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/dashboard"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 