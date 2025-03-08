import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/app/services/blogService';

export const runtime = 'edge';
export const alt = 'Blog Post';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #4F46E5, #7C3AED)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <h1
          style={{
            fontSize: '60px',
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          {post?.title || 'Blog Post'}
        </h1>
        <p
          style={{
            fontSize: '30px',
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
          }}
        >
          {post?.description || ''}
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
} 