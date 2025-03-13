// Okuma süresini hesapla (dakika cinsinden)
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200; // Ortalama okuma hızı
  const words = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(words / wordsPerMinute);
  return Math.max(1, readTime); // En az 1 dakika
}

// Tarihi formatla
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Kapak resmi yolunu formatla
export function formatCoverImagePath(imagePath: string): string {
  if (!imagePath) return '';
  
  // Base64 görüntüler için dokunma
  if (imagePath.startsWith('data:')) return imagePath;
  
  // URL'ler için dokunma
  if (imagePath.startsWith('http')) return imagePath;
  
  // Yerel dosya yollarını düzenle
  const fileName = imagePath.split('/').pop();
  return `/images/covers/${fileName}`;
} 