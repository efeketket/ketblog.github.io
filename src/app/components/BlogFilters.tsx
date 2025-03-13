'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiX, FiGrid, FiList } from 'react-icons/fi';

type FilterType = 'new' | 'popular' | 'trending' | 'tags';
type ViewMode = 'compact' | 'expanded';

interface BlogFiltersProps {
  onFilterChange: (type: FilterType) => void;
  onTagSelect: (tag: string) => void;
  onSearch: (query: string) => void;
  selectedTags: string[];
  availableTags: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function BlogFilters({
  onFilterChange,
  onTagSelect,
  onSearch,
  selectedTags,
  availableTags,
  viewMode,
  onViewModeChange
}: BlogFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('new');
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterClick = (type: FilterType) => {
    if (type === 'tags') {
      setShowTagsDropdown(!showTagsDropdown);
    } else {
      setActiveFilter(type);
      setShowTagsDropdown(false);
      onFilterChange(type);
    }
  };

  const handleTagClick = (tag: string) => {
    onTagSelect(tag);
    setShowTagsDropdown(false); // Etiket seçilince menüyü kapat
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Tıklama olaylarını dinle
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.tags-dropdown-container')) {
        setShowTagsDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterClick('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'new'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Yeni
          </button>
          <button
            onClick={() => handleFilterClick('popular')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'popular'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Popüler
          </button>
          <button
            onClick={() => handleFilterClick('trending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === 'trending'
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Trend
          </button>
          <div className="relative tags-dropdown-container">
            <button
              onClick={() => handleFilterClick('tags')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showTagsDropdown
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Etiketler
            </button>
            {showTagsDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-gray-200 dark:border-gray-700 pr-4">
            <button
              onClick={() => onViewModeChange('compact')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'compact'
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('expanded')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'expanded'
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Blog ara..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSearch('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full text-sm"
            >
              {tag}
              <FiX className="w-4 h-4" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 