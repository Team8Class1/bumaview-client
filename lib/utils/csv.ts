import fs from 'fs';
import path from 'path';
import { Question, QuestionStats } from '@/types/question';

export function parseCSV(csvContent: string): Question[] {
  const lines = csvContent.trim().split('\n');
  lines[0].split(','); // headers
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    const question: Question = {
      id: (index + 1).toString(),
      question: values[0] || '',
      category: values[1] || '',
      company: values[2] || '',
      question_at: values[3] || '',
      author: 'u�',
      tags: values[1] ? [values[1]] : [],
      createdAt: new Date().toISOString(),
      views: Math.floor(Math.random() * 500) + 1,
      likes: Math.floor(Math.random() * 50) + 1,
      replies: Math.floor(Math.random() * 20) + 1
    };
    return question;
  });
}

export async function loadQuestionsFromCSV(): Promise<Question[]> {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'seed', 'interview.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    return parseCSV(csvContent);
  } catch (error) {
    console.error('Error loading CSV:', error);
    // Return mock data as fallback
    const mockQuestions: Question[] = [
      {
        id: "1",
        question: "간단한 자기소개",
        category: "back",
        company: "마이다스IT",
        question_at: "2023",
        author: "익명",
        tags: ["back"],
        createdAt: new Date().toISOString(),
        views: 152,
        likes: 23,
        replies: 7
      },
      {
        id: "2",
        question: "가장 기억에 남는 프로젝트는?",
        category: "back", 
        company: "마이다스IT",
        question_at: "2023",
        author: "익명",
        tags: ["back"],
        createdAt: new Date().toISOString(),
        views: 89,
        likes: 15,
        replies: 4
      },
      {
        id: "3",
        question: "프로젝트를 하면서 가장 중요하다고 생각하는 것은?",
        category: "back",
        company: "마이다스IT", 
        question_at: "2023",
        author: "익명",
        tags: ["back"],
        createdAt: new Date().toISOString(),
        views: 203,
        likes: 31,
        replies: 12
      }
    ];
    return mockQuestions;
  }
}

export function getQuestionStats(questions: Question[]): QuestionStats {
  const questionsByCategory: Record<string, number> = {};
  const questionsByCompany: Record<string, number> = {};
  const questionsByYear: Record<string, number> = {};

  questions.forEach(q => {
    // Category stats
    questionsByCategory[q.category] = (questionsByCategory[q.category] || 0) + 1;
    
    // Company stats
    questionsByCompany[q.company] = (questionsByCompany[q.company] || 0) + 1;
    
    // Year stats
    questionsByYear[q.question_at] = (questionsByYear[q.question_at] || 0) + 1;
  });

  return {
    totalQuestions: questions.length,
    totalCompanies: Object.keys(questionsByCompany).length,
    totalCategories: Object.keys(questionsByCategory).length,
    questionsByCategory,
    questionsByCompany,
    questionsByYear
  };
}

export function filterQuestions(questions: Question[], filters: {
  search?: string;
  category?: string;
  company?: string;
  year?: string;
}): Question[] {
  return questions.filter(question => {
    if (filters.search && !question.question.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    if (filters.category && question.category !== filters.category) {
      return false;
    }
    
    if (filters.company && question.company !== filters.company) {
      return false;
    }
    
    if (filters.year && question.question_at !== filters.year) {
      return false;
    }
    
    return true;
  });
}

export function sortQuestions(questions: Question[], sortBy: 'recent' | 'oldest' | 'likes' | 'views' = 'recent'): Question[] {
  return [...questions].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'oldest':
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case 'likes':
        return (b.likes || 0) - (a.likes || 0);
      case 'views':
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });
}