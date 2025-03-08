import { Post } from '../types/post';

const POSTS_PER_PAGE = 5;

const dummyPosts: Post[] = [
  {
    id: 1,
    title: 'Next.js ile Modern Web Geliştirme',
    description: 'Modern web uygulamaları geliştirmek için Next.js framework\'ünün sunduğu avantajlar ve best practice\'ler.',
    content: 'Next.js, React tabanlı web uygulamaları geliştirmek için mükemmel bir framework\'tür. Server-side rendering, static site generation, API routes gibi özellikleri ile modern web uygulamaları geliştirmeyi kolaylaştırır. Bu yazıda, Next.js\'in sunduğu temel özellikleri, performans optimizasyonları ve en iyi uygulama örneklerini inceleyeceğiz. Ayrıca, Next.js 13 ile gelen App Router, Server Components gibi yeni özelliklere de değineceğiz.',
    slug: 'nextjs-ile-modern-web-gelistirme',
    readTime: 5,
    tags: ['Web Geliştirme', 'Next.js', 'React', 'JavaScript'],
    createdAt: '7 Mart 2024',
    updatedAt: '7 Mart 2024',
    author: {
      name: 'Efe Ketket',
      avatar: 'https://github.com/ketket.png'
    },
    views: 523
  },
  {
    id: 2,
    title: 'TypeScript\'te İleri Seviye Teknikler',
    description: 'TypeScript ile daha güvenli ve ölçeklenebilir uygulamalar geliştirmek için kullanabileceğiniz ileri seviye özellikler.',
    content: 'TypeScript, JavaScript\'e tip güvenliği ekleyerek daha güvenilir ve bakımı kolay uygulamalar geliştirmenizi sağlar. Bu yazıda, TypeScript\'in ileri seviye özelliklerini, jenerikler, conditional types, mapped types gibi konuları detaylı bir şekilde inceleyeceğiz. Ayrıca, TypeScript ile daha iyi kod yazmanın yollarını ve best practice\'leri de öğreneceksiniz.',
    slug: 'typescript-ileri-seviye-teknikler',
    readTime: 8,
    tags: ['Programlama', 'TypeScript', 'JavaScript', 'Tip Sistemi'],
    createdAt: '6 Mart 2024',
    updatedAt: '6 Mart 2024',
    author: {
      name: 'Efe Ketket',
      avatar: 'https://github.com/ketket.png'
    },
    views: 428
  }
];

export function getPaginatedPosts(page: number) {
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = dummyPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(dummyPosts.length / POSTS_PER_PAGE);

  return {
    posts,
    totalPages,
  };
}

export function getPostBySlug(slug: string): Post | undefined {
  return dummyPosts.find(post => post.slug === slug);
} 