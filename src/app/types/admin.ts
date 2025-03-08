export interface Admin {
  email: string;
  nickname: string;
  avatar: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
} 