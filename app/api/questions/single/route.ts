import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, category, company, year } = body;
    
    if (!question || !category || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Mock question creation
    const newQuestion = {
      id: Date.now().toString(),
      question,
      category,
      company,
      question_at: year || new Date().getFullYear().toString(),
      author: '익명',
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      replies: 0
    };
    
    return NextResponse.json({ 
      message: 'Question created successfully',
      question: newQuestion
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}