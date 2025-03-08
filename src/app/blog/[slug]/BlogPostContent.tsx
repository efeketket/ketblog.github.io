'use client';

import { Post } from '@/app/types/post';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiCalendar, FiEye, FiArrowLeft, FiEdit2, FiCheck, FiX, FiPlus, FiTag, FiUpload, FiSave, FiImage, FiTrash2 } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import TagSelector from '@/app/components/TagSelector';

interface BlogPostContentProps {
  post: Post;
  defaultIsEditing?: boolean;
}

export default function BlogPostContent({ post: initialPost, defaultIsEditing = false }: BlogPostContentProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(defaultIsEditing);
  const [post, setPost] = useState(initialPost);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedDescription, setEditedDescription] = useState(post.description);
  const [editedTags, setEditedTags] = useState<string[]>(post.tags || []);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(post.coverImage || null);
  const [authorName, setAuthorName] = useState(post.author?.name || '');
  const [authorBio, setAuthorBio] = useState(post.author?.bio || '');
  const [authorAvatar, setAuthorAvatar] = useState(post.author?.avatar || '');
  const [avatarPreview, setAvatarPreview] = useState(post.author?.avatar || '');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminEmail = localStorage.getItem('adminEmail');
      const wasAdmin = isAdmin;
      setIsAdmin(!!adminEmail);
      
      if (wasAdmin && !adminEmail && isEditing) {
        handleCancel();
      }
    };

    checkAdminStatus();
    window.addEventListener('storage', checkAdminStatus);

    if (searchParams.get('edit') === 'true' && isAdmin) {
      setIsEditing(true);
    }

    return () => {
      window.removeEventListener('storage', checkAdminStatus);
    };
  }, [searchParams, isAdmin]);

  useEffect(() => {
    const hasChanges = 
      editedContent !== post.content ||
      editedTitle !== post.title ||
      editedDescription !== post.description ||
      JSON.stringify(editedTags) !== JSON.stringify(post.tags) ||
      imagePreview !== post.coverImage ||
      authorName !== post.author?.name ||
      authorBio !== post.author?.bio ||
      authorAvatar !== post.author?.avatar;

    setHasUnsavedChanges(hasChanges);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [editedContent, editedTitle, editedDescription, editedTags, imagePreview, authorName, authorBio, authorAvatar, post]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const adminEmail = localStorage.getItem('adminEmail');
      if (!adminEmail) {
        throw new Error('Admin girişi yapılmamış');
      }

      const updateData = {
        ...post,
        title: editedTitle,
        description: editedDescription,
        content: editedContent,
        tags: editedTags,
        coverImage: imagePreview || '',
        author: {
          name: authorName,
          avatar: authorAvatar,
          bio: authorBio
        },
        updatedAt: new Date().toISOString()
      };

      const encodedSlug = encodeURIComponent(post.slug);
      const response = await fetch(`/api/posts/${encodedSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': adminEmail,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Blog yazısı güncellenirken bir hata oluştu');
      }

      const updatedPost = await response.json();
      setPost(updatedPost);
      setEditedContent(updatedPost.content);
      setEditedTitle(updatedPost.title);
      setEditedDescription(updatedPost.description);
      setEditedTags(updatedPost.tags || []);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      router.refresh();
    } catch (error) {
      console.error('Hata oluştu:', error);
      alert(error instanceof Error ? error.message : 'Blog yazısı güncellenirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    try {
      const adminEmail = localStorage.getItem('adminEmail');
      if (!adminEmail) {
        throw new Error('Admin girişi yapılmamış');
      }

      const encodedSlug = encodeURIComponent(post.slug);
      const response = await fetch(`/api/posts/${encodedSlug}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Email': adminEmail,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Blog yazısı silinirken bir hata oluştu');
      }

      router.push('/');
    } catch (error) {
      console.error('Hata oluştu:', error);
      alert(error instanceof Error ? error.message : 'Blog yazısı silinirken bir hata oluştu');
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const shouldSave = window.confirm('Kaydedilmemiş değişiklikleriniz var. Kaydetmek ister misiniz?');
      if (shouldSave) {
        handleSave();
        return;
      }
    }

    setEditedContent(post.content);
    setEditedTitle(post.title);
    setEditedDescription(post.description);
    setEditedTags(post.tags || []);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    router.replace(`/blog/${post.slug}`);
  };

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <div className="relative">
        <div className="relative w-full h-[400px] mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/20 dark:to-indigo-900/5">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <FiImage className="w-16 h-16 text-indigo-300 dark:text-indigo-600" />
            </div>
          )}
          
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
              <label className="cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2 text-white">
                  <FiUpload className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Görsel Yükle</span>
                </div>
              </label>
            </div>
          )}
        </div>

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
                    onClick={handleDelete}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Sil</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="flex items-center gap-6 mb-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image 
                  src={authorAvatar} 
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{authorName}</span>
            </div>

            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>

          <TagSelector selectedTags={editedTags} onTagsChange={setEditedTags} isEditing={isEditing} />

          <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none mt-8">
            {isEditing ? (
              <>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full h-20 mb-6 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                  placeholder="Açıklama"
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400"
                  placeholder="İçerik (Markdown formatında)"
                />
              </>
            ) : (
              <>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-6">{post.description}</p>
                <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-2xl font-bold mb-3 mt-6 text-gray-900 dark:text-white">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xl font-bold mb-2 mt-4 text-gray-900 dark:text-white">{children}</h3>,
                      p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-white">{children}</strong>,
                      em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-4 pl-4 text-gray-800 dark:text-gray-200">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-4 pl-4 text-gray-800 dark:text-gray-200">{children}</ol>,
                      li: ({ children }) => <li className="mb-1 text-gray-800 dark:text-gray-200">{children}</li>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-4 text-gray-700 dark:text-gray-300">{children}</blockquote>
                      ),
                      code: ({ children }) => (
                        <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-gray-800 dark:text-gray-200">{children}</code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 overflow-x-auto mb-4 text-gray-800 dark:text-gray-200">{children}</pre>
                      ),
                      a: ({ children, href }) => (
                        <a href={href} className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
} 