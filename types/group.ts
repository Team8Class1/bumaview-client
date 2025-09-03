// TypeScript types for question group data
export interface Group {
  id: string;
  name: string;
  description?: string;
  userId: string;
  questionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}