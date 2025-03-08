export interface Post {
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
} 