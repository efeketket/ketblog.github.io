import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/app/lib/posts';
import BlogPostContent from './BlogPostContent';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
} 