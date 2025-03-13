'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminEmail = localStorage.getItem('adminEmail');
      const token = localStorage.getItem('token');
      setIsAdmin(!!(adminEmail && token));
    };

    checkAdminStatus();
    window.addEventListener('storage', checkAdminStatus);
    return () => window.removeEventListener('storage', checkAdminStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('token');
    setIsAdmin(false);
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            Blog
          </Link>

          <div className="flex items-center gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Admin Modu
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors inline-flex items-center gap-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Çıkış</span>
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-2"
              >
                <FiLogIn className="w-4 h-4" />
                <span>Giriş</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 