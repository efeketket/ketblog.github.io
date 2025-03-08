import { getPostBySlug } from '@/app/lib/posts';
import { Metadata } from 'next';

interface BlogPostLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostLayoutProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Blog Yazısı Bulunamadı',
      description: 'İstediğiniz blog yazısı bulunamadı.',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      authors: post.author?.name ? [post.author.name] : [],
    },
  };
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return children;
} 