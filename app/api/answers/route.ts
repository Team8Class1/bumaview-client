import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Answers API - Coming Soon", answers: [] });
}

export async function POST() {
  return NextResponse.json({ message: "Answer created - Coming Soon" });
}