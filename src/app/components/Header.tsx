'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem('adminEmail');
    if (email) {
      setAdminEmail(email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    setAdminEmail(null);
    // Cookie'yi temizle
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Sayfayı yenile
    router.refresh();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Ketket's Developments
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {adminEmail ? (
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {adminEmail}
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-md transition-colors duration-200"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/admin/login" 
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-md transition-colors duration-200"
              >
                Admin Girişi
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
} 