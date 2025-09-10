import { NextResponse } from 'next/server';

export async function GET() {
  const mockProfile = {
    name: "김개발",
    email: "dev@example.com",
    bio: "5년차 풀스택 개발자입니다.",
    github: "github.com/devkim",
    interests: ["React", "Node.js", "TypeScript"]
  };
  return NextResponse.json({ profile: mockProfile });
}

export async function PATCH() {
  return NextResponse.json({ message: "Profile updated successfully" });
}