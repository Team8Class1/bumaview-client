import { NextResponse } from 'next/server';

const companies = [
  { id: 1, name: "마이다스IT", description: "IT 서비스 및 솔루션 제공", questionCount: 16 },
  { id: 2, name: "신한은행", description: "대한민국 대표 상업은행", questionCount: 8 }
];

export async function GET() {
  return NextResponse.json({ companies });
}