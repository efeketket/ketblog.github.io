'use client';

import { useState, useEffect } from 'react';
import { FiPlus, FiX, FiCheck, FiTag } from 'react-icons/fi';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  isEditing?: boolean;
}

export default function TagSelector({ selectedTags, onTagsChange, isEditing = false }: TagSelectorProps) {
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const data = await response.json();
        setAvailableTags(data.tags);
      } catch (error) {
        console.error('Etiketler yüklenirken hata:', error);
      }
    };
    fetchTags();
  }, []);

  const handleAddNewTag = async () => {
    if (newTag.trim()) {
      try {
        const adminEmail = localStorage.getItem('adminEmail');
        if (!adminEmail) {
          throw new Error('Admin girişi yapılmamış');
        }

        const response = await fetch('/api/tags', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Email': adminEmail,
          },
          body: JSON.stringify({ tag: newTag.trim() }),
        });

        if (response.ok) {
          const data = await response.json();
          setAvailableTags(data.tags);
          if (!selectedTags.includes(newTag.trim())) {
            onTagsChange([...selectedTags, newTag.trim()]);
          }
        } else {
          const data = await response.json();
          if (response.status === 400) {
            // Etiket zaten varsa sadece seç
            if (!selectedTags.includes(newTag.trim())) {
              onTagsChange([...selectedTags, newTag.trim()]);
            }
          } else {
            throw new Error(data.error || 'Etiket eklenirken bir hata oluştu');
          }
        }

        setNewTag('');
        setIsAdding(false);
      } catch (error) {
        console.error('Etiket eklenirken hata:', error);
        alert(error instanceof Error ? error.message : 'Etiket eklenirken bir hata oluştu');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewTag();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTag('');
    }
  };

  const handleTagToggle = (tag: string) => {
    onTagsChange(
      selectedTags.includes(tag)
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-full"
          >
            <FiTag className="w-4 h-4" />
            {tag}
            {isEditing && (
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </span>
        ))}
        {isEditing && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <FiPlus className="w-4 h-4" />
            Etiket Ekle
          </button>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Etiket Ekle</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Yeni etiket..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                autoFocus
              />
              <button
                onClick={handleAddNewTag}
                disabled={!newTag.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ekle
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    handleTagToggle(tag);
                    setIsAdding(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FiTag className="w-4 h-4" />
                  <span>{tag}</span>
                  {selectedTags.includes(tag) && <FiCheck className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 