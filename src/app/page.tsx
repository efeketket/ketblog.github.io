import { getPosts } from '@/app/lib/posts';
import BlogPost from '@/app/components/BlogPost';

export default async function Home() {
  const posts = await getPosts();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPost key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}