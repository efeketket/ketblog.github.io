import { getPosts, getPostBySlug } from '@/app/lib/posts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
      <div className="prose dark:prose-invert max-w-none">
        {post.content}
      </div>
    </article>
  );
} 