"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle, ThumbsUp, Eye, Calendar, Building } from "lucide-react";
import { Question } from "@/types/question";
import { useState, useEffect } from "react";

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <Link 
          href={`/questions/${question.id}`}
          className="flex-1"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {question.question}
          </h3>
        </Link>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center space-x-1 text-sm">
          <Building className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-300">{question.company}</span>
        </div>
        <div className="flex items-center space-x-1 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-700 dark:text-gray-300">{question.question_at}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-md">
          {question.category}
        </div>
        {question.tags && question.tags.map((tag, index) => (
          <Link 
            key={index} 
            href={`/tags/${tag}`}
            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{question.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{question.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{question.replies}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 dark:text-gray-300">
            by <span className="font-medium">{question.author || '익명'}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

interface RecentQuestionsProps {
  limit?: number;
}

export function RecentQuestions({ limit = 5 }: RecentQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        const data = await response.json();
        setQuestions(data.slice(0, limit));
      } catch (error) {
        console.error('Failed to load questions:', error);
        // Fallback to mock data
        const mockQuestions: Question[] = [
          {
            id: "1",
            question: "간단한 자기소개",
            category: "back",
            company: "마이다스IT",
            question_at: "2023",
            author: "익명",
            tags: ["back"],
            createdAt: "2024-01-15T10:30:00Z",
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
            createdAt: "2024-01-14T15:22:00Z",
            views: 89,
            likes: 15,
            replies: 4
          }
        ];
        setQuestions(mockQuestions.slice(0, limit));
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          최신 질문
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          최신 질문
        </h2>
        <Button variant="ghost" asChild>
          <Link href="/questions">
            더 보기
          </Link>
        </Button>
      </div>
      
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>
      
      <div className="text-center pt-4">
        <Button asChild>
          <Link href="/questions/new">
            질문 등록하기
          </Link>
        </Button>
      </div>
    </div>
  );
}