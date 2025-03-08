'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiTag, FiX, FiImage, FiBold, FiItalic, FiLink, FiList, FiCode } from 'react-icons/fi';
import Image from 'next/image';

export default function NewBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAuthorAvatar(base64String);
        setAvatarPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCoverImage(base64String);
        setCoverImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagToggle = (tag: string) => {
    setTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        end + before.length
      );
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const adminEmail = localStorage.getItem('adminEmail');
      if (!adminEmail) {
        throw new Error('Admin girişi yapılmamış');
      }

      const slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const postData = {
        title,
        content,
        description,
        tags,
        coverImage,
        slug,
        author: {
          name: authorName,
          avatar: authorAvatar,
          bio: authorBio
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': adminEmail
        },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Yazı kaydedilirken bir hata oluştu');
      }

      const post = await response.json();
      router.push(`/blog/${post.slug}`);
    } catch (error) {
      console.error('Yazı kaydedilirken hata:', error);
      alert(error instanceof Error ? error.message : 'Yazı kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        <div className="space-y-6">
          {/* Kapak Resmi */}
          <div className="relative w-full h-[300px] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            {coverImagePreview ? (
              <Image
                src={coverImagePreview}
                alt="Kapak resmi"
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <FiImage className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
              <span className="text-white font-medium">Kapak Resmi Seç</span>
            </label>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none text-gray-900 dark:text-white"
            placeholder="Başlık"
            required
          />
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-20 bg-transparent border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none text-gray-900 dark:text-white"
            placeholder="Açıklama"
            required
          />

          <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Yazar Bilgileri
            </h3>
            
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Yazar fotoğrafı"
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <FiImage className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <span className="text-white text-sm font-medium">Fotoğraf Seç</span>
                </label>
              </div>
              
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none text-gray-900 dark:text-white"
                  placeholder="Yazar adı"
                  required
                />
                
                <textarea
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  className="w-full h-20 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none text-gray-900 dark:text-white"
                  placeholder="Yazar biyografisi"
                />
              </div>
            </div>
          </div>

          {/* İçerik Düzenleme Araçları */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-t-lg border border-gray-200 dark:border-gray-700 border-b-0">
            <div className="flex gap-2 p-2">
              <button
                type="button"
                onClick={() => insertText('**', '**')}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Kalın"
              >
                <FiBold className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('*', '*')}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="İtalik"
              >
                <FiItalic className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('[', '](URL)')}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Link"
              >
                <FiLink className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('- ')}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Liste"
              >
                <FiList className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => insertText('```\n', '\n```')}
                className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Kod Bloğu"
              >
                <FiCode className="w-5 h-5" />
              </button>
              <label className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer" title="Resim Ekle">
                <FiImage className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64String = reader.result as string;
                        insertText(`![${file.name}](${base64String})`);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-b-lg p-4 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none text-gray-900 dark:text-white font-mono"
            placeholder="İçerik (Markdown formatında)"
            required
          />

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => setIsTagModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-sm hover:bg-indigo-200 dark:hover:bg-indigo-800/50"
              >
                <FiTag className="w-4 h-4" />
                Etiket Ekle
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="w-5 h-5" />
            {isSaving ? 'Kaydediliyor...' : 'Yayınla'}
          </button>
        </div>
      </form>

      {/* Etiket Modalı */}
      {isTagModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Etiket Ekle</h2>
              <button
                onClick={() => setIsTagModalOpen(false)}
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
                onKeyDown={handleAddTag}
                placeholder="Yeni etiket..."
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
              />
              <button
                onClick={() => {
                  if (newTag.trim()) {
                    setTags(prev => [...prev, newTag.trim()]);
                    setNewTag('');
                  }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Ekle
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    tags.includes(tag)
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FiTag className="w-4 h-4" />
                  <span>{tag}</span>
                  {tags.includes(tag) && <FiX className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 