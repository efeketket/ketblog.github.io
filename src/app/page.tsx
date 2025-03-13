'use client';

import { useState, useEffect } from 'react';
import BlogPostCard from './components/BlogPostCard';
import BlogFilters from './components/BlogFilters';
import { Post } from './types/post';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'new' | 'popular' | 'trending' | 'tags'>('new');
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
        
        // İlk yüklemede tarihe göre sırala
        const sortedPosts = [...data].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFilteredPosts(sortedPosts);

        // Tüm etiketleri topla
        const tags = new Set<string>();
        data.forEach((post: Post) => {
          post.tags.forEach(tag => tags.add(tag));
        });
        setAvailableTags(Array.from(tags));
      } catch (error) {
        console.error('Blog yazıları yüklenirken hata:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleFilterChange = (type: 'new' | 'popular' | 'trending' | 'tags') => {
    setActiveFilter(type);
    let sorted = [...posts];

    switch (type) {
      case 'new':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'trending':
        sorted.sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0));
        break;
    }

    applyFilters(sorted);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      
      const sorted = sortPostsByActiveFilter([...posts]);
      applyFilters(sorted, newTags, searchQuery);
      return newTags;
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const sorted = sortPostsByActiveFilter([...posts]);
    applyFilters(sorted, selectedTags, query);
  };

  const sortPostsByActiveFilter = (posts: Post[]): Post[] => {
    switch (activeFilter) {
      case 'new':
        return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popular':
        return posts.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'trending':
        return posts.sort((a, b) => (b.trendScore || 0) - (a.trendScore || 0));
      default:
        return posts;
    }
  };

  const applyFilters = (posts: Post[], tags: string[] = selectedTags, search: string = searchQuery) => {
    let filtered = [...posts];

    // Etiket filtresi
    if (tags.length > 0) {
      filtered = filtered.filter(post =>
        tags.every(tag => post.tags.includes(tag))
      );
    }

    // Arama filtresi
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.description.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredPosts(filtered);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Yazıları</h1>
      </div>

      <BlogFilters
        onFilterChange={handleFilterChange}
        onTagSelect={handleTagSelect}
        onSearch={handleSearch}
        selectedTags={selectedTags}
        availableTags={availableTags}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className={`grid gap-8 ${
        viewMode === 'compact'
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1'
      }`}>
        {filteredPosts.map((post) => (
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