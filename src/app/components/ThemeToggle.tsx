'use client';

import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    setIsDark(theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 z-50"
      aria-label="Temayı değiştir"
    >
      {isDark ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
    </button>
  );
} 