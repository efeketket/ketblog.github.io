export interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
} 