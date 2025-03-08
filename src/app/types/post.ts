export interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  slug: string;
  readTime: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    avatar: string;
  };
  views: number;
} 