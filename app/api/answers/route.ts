import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Answers API - Coming Soon", answers: [] });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Answer created - Coming Soon" });
}