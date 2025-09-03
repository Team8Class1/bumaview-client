import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;
    
    if (!question) {
      return NextResponse.json({ error: 'Question text required' }, { status: 400 });
    }
    
    // Mock AI duplicate detection
    const similarity = Math.random() * 100;
    const isDuplicate = similarity > 75;
    
    return NextResponse.json({
      isDuplicate,
      similarity: Math.round(similarity),
      message: isDuplicate 
        ? 'Similar question found - Admin approval required'
        : 'No similar questions found',
      suggestedQuestions: isDuplicate ? [
        'React useEffect와 관련된 기존 질문',
        'Hook 사용법에 대한 유사 질문'
      ] : []
    });
  } catch (error) {
    return NextResponse.json({ error: 'Duplicate check failed' }, { status: 500 });
  }
}