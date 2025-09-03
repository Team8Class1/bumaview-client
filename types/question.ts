// TypeScript types for question-related data structures
export interface Question {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  companyId?: string;
  tags: string[];
}