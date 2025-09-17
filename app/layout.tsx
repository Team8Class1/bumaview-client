import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // 모노스페이스 폰트는 필요할 때만 로드
});

export const metadata: Metadata = {
  title: "BumaView - 개발자 면접 질문 공유 플랫폼",
  description: "실제 면접에서 받은 질문들을 공유하고, 다른 개발자들과 함께 답변을 준비하세요. 함께 성장하는 개발 문화를 만들어갑니다.",
  keywords: "개발자, 면접, 질문, 답변, 취업, 프로그래밍, 개발",
  authors: [{ name: "BumaView Team" }],
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        {children}
        <Toaster 
          position="bottom-right"
          closeButton
          richColors
          theme="dark"
        />
      </body>
    </html>
  );
}
