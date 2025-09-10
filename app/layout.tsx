import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster 
            position="bottom-right"
            closeButton
            richColors
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
