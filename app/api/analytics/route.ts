import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: "Analytics API - Coming Soon",
    data: {
      totalQuestions: 0,
      totalUsers: 0,
      totalCompanies: 0
    }
  });
}