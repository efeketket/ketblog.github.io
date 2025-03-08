'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiUser, FiMail, FiLink, FiTwitter, FiGithub, FiLinkedin, FiGlobe, FiUpload, FiSave } from 'react-icons/fi';
import { Admin } from '@/app/types/admin';

export default function AdminProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const adminEmail = localStorage.getItem('adminEmail');
        if (!adminEmail) {
          router.replace('/');
          return;
        }

        const response = await fetch('/api/admin/profile', {
          headers: {
            'X-Admin-Email': adminEmail
          }
        });

        if (!response.ok) {
          throw new Error('Profil yüklenemedi');
        }

        const data = await response.json();
        setProfile(data);
        setImagePreview(data.avatar);
      } catch (error) {
        console.error('Profil yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile) return;

    try {
      setIsSaving(true);
      const adminEmail = localStorage.getItem('adminEmail');
      if (!adminEmail) {
        throw new Error('Admin girişi yapılmamış');
      }

      const formData = new FormData(event.currentTarget);
      const updatedProfile = {
        ...profile,
        nickname: formData.get('nickname') as string,
        bio: formData.get('bio') as string,
        avatar: imagePreview,
        socialLinks: {
          twitter: formData.get('twitter') as string,
          github: formData.get('github') as string,
          linkedin: formData.get('linkedin') as string,
          website: formData.get('website') as string,
        }
      };

      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': adminEmail
        },
        body: JSON.stringify(updatedProfile)
      });

      if (!response.ok) {
        throw new Error('Profil güncellenemedi');
      }

      const data = await response.json();
      setProfile(data);
      alert('Profil başarıyla güncellendi!');
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      alert('Profil güncellenirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Profil Ayarları
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Bölümü */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profil fotoğrafı"
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <FiUser className="w-16 h-16 text-gray-400" />
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <FiUpload className="w-8 h-8 text-white" />
            </label>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Profil fotoğrafını değiştirmek için tıkla
          </p>
        </div>

        {/* Temel Bilgiler */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <FiMail className="text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">{profile.email}</span>
            </div>
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              defaultValue={profile.nickname}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Biyografi
            </label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio}
              rows={4}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* Sosyal Medya Linkleri */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sosyal Medya Bağlantıları
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="twitter" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiTwitter /> Twitter
              </label>
              <input
                type="url"
                id="twitter"
                name="twitter"
                defaultValue={profile.socialLinks?.twitter}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400"
              />
            </div>

            <div>
              <label htmlFor="github" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiGithub /> GitHub
              </label>
              <input
                type="url"
                id="github"
                name="github"
                defaultValue={profile.socialLinks?.github}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400"
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiLinkedin /> LinkedIn
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                defaultValue={profile.socialLinks?.linkedin}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400"
              />
            </div>

            <div>
              <label htmlFor="website" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FiGlobe /> Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                defaultValue={profile.socialLinks?.website}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Kaydet Butonu */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="w-5 h-5" />
            <span>{isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
          </button>
        </div>
      </form>
    </div>
  );
} 