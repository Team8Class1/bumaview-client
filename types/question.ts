export interface Question {
  id: string;
  question: string;
  category: string;
  company: string;
  question_at: string;
  author?: string;
  tags?: string[];
  createdAt?: string;
  views?: number;
  likes?: number;
  replies?: number;
}

export interface QuestionFilters {
  search?: string;
  category?: string;
  company?: string;
  year?: string;
  sort?: 'recent' | 'oldest' | 'likes' | 'views';
}

export interface QuestionStats {
  totalQuestions: number;
  totalCompanies: number;
  totalCategories: number;
  questionsByCategory: Record<string, number>;
  questionsByCompany: Record<string, number>;
  questionsByYear: Record<string, number>;
}