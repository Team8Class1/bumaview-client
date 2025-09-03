// TypeScript types for user and profile data
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
}