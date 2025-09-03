import { NextRequest, NextResponse } from 'next/server';
import { loadQuestionsFromCSV, filterQuestions, sortQuestions } from '@/lib/utils/csv';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const company = searchParams.get('company');
    const year = searchParams.get('year');
    const sort = searchParams.get('sort') as 'recent' | 'oldest' | 'likes' | 'views' || 'recent';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Load questions from CSV
    let questions = await loadQuestionsFromCSV();
    
    // Apply filters
    if (search || category || company || year) {
      questions = filterQuestions(questions, {
        search: search || undefined,
        category: category || undefined,
        company: company || undefined,
        year: year || undefined
      });
    }
    
    // Sort questions
    questions = sortQuestions(questions, sort);
    
    // Limit results
    if (limit > 0) {
      questions = questions.slice(0, limit);
    }
    
    return NextResponse.json(questions);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to load questions' },
      { status: 500 }
    );
  }
}