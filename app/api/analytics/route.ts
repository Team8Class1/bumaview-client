import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: "Analytics API - Coming Soon",
    data: {
      totalQuestions: 0,
      totalUsers: 0,
      totalCompanies: 0
    }
  });
}