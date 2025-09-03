import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const mockGroups = [
    { id: 1, name: "프론트엔드 면접 질문", isPublic: true, questionCount: 15 },
    { id: 2, name: "백엔드 기초", isPublic: false, questionCount: 8 }
  ];
  return NextResponse.json({ groups: mockGroups });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: "Group created successfully" });
}