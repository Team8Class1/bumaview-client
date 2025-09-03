// TypeScript types for answer data
export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}